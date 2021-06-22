import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterContentInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { round, get, divide } from 'lodash';
import * as moment from 'moment';
import 'moment-duration-format';
moment.locale( 'fr' );

import {
  initialEvalCatColors,
  moduleCatColors
} from '../../../utils/chart.util';
import { PrintWidgetComponent } from '../../../shared/components';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ProgTable',
  template: `
  <div class="container">
    <mat-card
      id="table-view"
      class="widget-card table-widget"
      data-simplebar
      data-simplebar-auto-hide="false"
      (mouseenter)="hoverWidgetTraceHandler.emit({event: 'mouseenter',id: 'table-view'})"
      (mouseleave)="hoverWidgetTraceHandler.emit({event: 'mouseleave',id: 'table-view'})">
      <mat-card-header>
        <span class="fill"></span>
        <PrintWidget
          *ngIf="isStartPrintReport"
          [widgetId]="'table-view'"
          [checked]="selectedWidgets.includes('table-view')"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)">
        </PrintWidget>
        <button
          mat-button
          (click)="exportTableToCsvHandler.emit({
            tableName: 'details', data: userListData
          })">
            <mat-icon class="mat-24" aria-label="cloud_download">cloud_download</mat-icon>
            <span class="csv-export">Export CSV</span>
        </button>
      </mat-card-header>
      <mat-card-content>
        <TableViewManager
          class="table-widget"
          [tableMode]="'normal'"
          [data]="userListData | values"
          [columns]="columns"
          [options]="{ filter: true, header: true }"
          [colDefaultWidth]="colDefaultWidth"
          [colDefaultHeight]="colDefaultHeight"
          [isStartPrintReport]="isStartPrintReport"
          [selectedWidgets]="selectedWidgets"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)"
          (sortColumnTraceHandler)="sortColumnTraceHandler.emit($event)"
          (filterColumnTraceHandler)="filterColumnTraceHandler.emit($event)"
          (userMoreMenuHandler)="userMoreMenuHandler.emit($event)">
        </TableViewManager>
      </mat-card-content>
    </mat-card>

    <mat-card
      id="line-chart"
      class="widget-card line-widget"
      (mouseenter)="hoverWidgetTraceHandler.emit({event: 'mouseenter',id: 'line-chart'})"
      (mouseleave)="hoverWidgetTraceHandler.emit({event: 'mouseleave',id: 'table-view'})">
      <mat-card-header>
        <mat-card-title>Progression dans le temps</mat-card-title>
        <mat-card-subtitle *ngIf="modulesData.isHasSupProAndSup">
          <div class="info">
            <mat-icon class="mat-24">info</mat-icon>
            <span>
              <span class="highlight">Supérieur</span> est équivalent à
              <span class="highlight">Pro</span> + <span class="highlight">Pont Supé.</span>
            </span>
          </div>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content #lineWidget>
        <MlineChart
          *ngIf="lineWidget.offsetWidth && lineWidget.offsetHeight"
          [data]="userListData | values"
          [modulesData]="modulesData"
          [width]="lineWidget.offsetWidth"
          [height]="lineWidget.offsetHeight"
          [timeScale]="'day'"
          [ykey]="'sumscore'">
        </MlineChart>
      </mat-card-content>
    </mat-card>

  </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: flex-start;
        width: 100vw;
        height: 100%;
      }
      .container {
        display: flex;
        margin-left: auto;
        margin-right: auto;
        padding: 3px;
        box-sizing: border-box;
      }
      .widget-card {
        padding: 0px;
        margin: 3px;
        box-sizing: border-box;
      }
      mat-card-content {
        padding: 12px 0px;
        width: calc(100% - 12px);
        height: 90%;
      }
      mat-card-header {
        padding: 0px 12px;
        box-sizing: border-box;
      }
      .widget-content {
        width: 100%;
        height: 100%;
      }
      .table-widget {
        width: 65vw;
        height: calc(100vh - 58px);
      }
      .line-widget {
        width: 35vw;
        height: calc(100vh - 58px);
        padding: 12px 0px;
        box-sizing: border-box;
      }
      .info {
        display: flex;
        align-items: center;
      }
      .highlight {
        background: #eee;
        font-weight: 300;
        display: inline-block;
        padding: 0 6px;
        border-radius: 10px;
        font-style: italic;
      }
      .export-btn {
        height: 24px;
        line-height: 24px;
      }
      .csv-export {
        display: inline-block;
        margin-left: 5px;
        font-size: smaller;
      }
    `,
  ],
})
export class ProgTableComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() isStartPrintReport;
  @Input() progTableMode;
  @Input() selectedWidgets: string[];
  @Input() modulesData: any;

  @Output() checkWidgetHandler = new EventEmitter();
  @Output() sortColumnTraceHandler = new EventEmitter();
  @Output() filterColumnTraceHandler = new EventEmitter();
  @Output() hoverWidgetTraceHandler = new EventEmitter();
  @Output() userMoreMenuHandler = new EventEmitter();
  @Output() exportTableToCsvHandler = new EventEmitter();

  userListData$ = new BehaviorSubject<any>({});

  colDefaultWidth = 100;
  colDefaultHeight = 30;
  columns = {};

  constructor () {}

  ngOnInit (): void {}

  ngAfterContentInit (): void {
    this.columns = {
      moremenu: {
        name: '',
        histo: '',
        encoding: 'NG',
        width: 24,
        topBottom: 0,
        filter: 0,
      },
      fullName: {
        name: 'Apprenant',
        histo: '',
        encoding: 'STRING',
        width: 110,
        topBottom: 0,
        filter: 0,
      },
      'score.sum': {
        name: 'Score',
        histo: 'ordinal',
        encoding: 'BAR',
        // hint: 'score.format',
        compositeHint: [ 'score.sum', 'score.count' ],
        subHint: this.scoreSubHint.bind( null, 'score' ),
        width: 90,
        topBottom: 0,
      },
      time: {
        name: 'Temps cumulé',
        // hint: 'time.format',
        formatter: this.timeFormatter,
        histo: 'ordinal',
        encoding: 'BAR',
        width: 80,
        topBottom: 0,
      },
      lastConnection: {
        name: 'Dernière connexion',
        histo: '',
        formatter: this.lastConnectionFormatter,
        encoding: 'STRING',
        width: 100,
        topBottom: 0,
        filter: '',
      },
      connectionsNbr: {
        name: 'Nbr. connexions',
        histo: 'ordinal',
        encoding: 'BAR',
        width: 80,
        topBottom: 0,
      },
      initialEval: {
        name: 'Éval. Initiale',
        histo: 'ordinal',
        encoding: 'BAR',
        width: 80,
        topBottom: 0,
      },
      'initialLevel.sum': {
        name: 'Règles sues initialement',
        compositeHint: [ 'initialLevel.sum', 'initialLevel.count' ],
        subHint: this.scoreSubHint.bind( null, 'initialLevel' ),
        histo: 'ordinal',
        encoding: 'BAR',
        width: 90,
        topBottom: 0,
      },
      lastModule: {
        name: 'Module atteint',
        histo: 'categorical',
        encoding: 'CAT',
        width: 100,
        topBottom: 0,
        color: get( this.modulesData, 'forColor' ),
      },
      print: {
        name: '',
        histo: '',
        encoding: 'NG',
        width: 35,
        topBottom: 0,
        filter: 0,
      },
    };
  }

  ngOnDestroy (): void {}

  @Input()
  set userListData ( value ) {
    this.userListData$.next( value );
  }

  get userListData () {
    return this.userListData$.getValue();
  }

  timeFormatter ( time ) {
    // replace mins in min because the moment add the letter 's' automatic.
    return moment
      .duration( time, 'minutes' )
      .format( 'h [h] mm [min]' )
      .replace( 'mins', 'min' );
  }

  lastConnectionFormatter ( date ) {
    const d = moment( date );
    return d.isValid() ? d.fromNow() : '';
  }

  scoreSubHint ( key, data ) {
    const d = divide( get( data, `${key}.sum`, 0 ), get( data, `${key}.count` )) * 100;
    return isNaN( d ) ? '0%' : round( d ) + '%';
  }
}

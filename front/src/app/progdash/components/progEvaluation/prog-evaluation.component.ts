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
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { isNil, map, uniq, reduce } from 'lodash';
import * as moment from 'moment';
import 'moment-duration-format';
moment.locale( 'fr' );

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ProgEvaluation',
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
          tableName: 'evaluations', data: evaluationsData
          })">
          <mat-icon class="mat-24" aria-label="cloud_download">cloud_download</mat-icon>
            <span class="csv-export">Export CSV</span>
        </button>
      </mat-card-header>
      <mat-card-content>
        <TableViewManager
          class="table-widget"
          [tableMode]="'normal'"
          [data]="evaluationsData"
          [columns]="columns"
          [options]="{ filter: true, header: true }"
          [colDefaultWidth]="colDefaultWidth"
          [colDefaultHeight]="colDefaultHeight"
          [isStartPrintReport]="isStartPrintReport"
          [selectedWidgets]="selectedWidgets"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)"
          (sortColumnTraceHandler)="sortColumnTraceHandler.emit($event)"
          (filterColumnTraceHandler)="filterColumnTraceHandler.emit($event)">
        </TableViewManager>
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
        padding: 0px;
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
        width: 700px !important;
        height: 100%;
      }
      mat-card-header {
        padding: 0px 24px;
        box-sizing: border-box;
      }
      .widget-content {
        width: 100%;
        height: 100%;
      }
      .table-widget {
        width: 700px;
        height: calc(100vh - 58px);
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
export class ProgEvaluationComponent
  implements OnInit, OnDestroy, AfterContentInit {
  @Input() isStartPrintReport;
  @Input() selectedWidgets: string[];

  @Output() checkWidgetHandler = new EventEmitter();
  @Output() sortColumnTraceHandler = new EventEmitter();
  @Output() filterColumnTraceHandler = new EventEmitter();
  @Output() hoverWidgetTraceHandler = new EventEmitter();
  @Output() exportTableToCsvHandler = new EventEmitter();

  evaluationsData$ = new BehaviorSubject<any>({});

  colDefaultWidth = 100;
  colDefaultHeight = 30;
  columns;

  constructor () {}

  ngOnInit (): void {}

  ngAfterContentInit (): void {
    this.columns = {
      fullName: {
        name: 'Apprenant',
        histo: '',
        encoding: 'STRING',
        width: 120,
        topBottom: 0,
      },
      evaluationName: {
        name: 'Évaluation',
        histo: 'categorical',
        encoding: 'CAT',
        width: 120,
        topBottom: 0,
        color: this.evalNameColors,
      },
      time: {
        name: 'Temps',
        histo: 'ordinal',
        encoding: 'BAR',
        width: 120,
        formatter: this.timeFormatter,
        topBottom: 0,
      },
      score: {
        name: 'Score',
        histo: 'ordinal',
        encoding: 'BAR',
        formatter: this.scoreFormatter,
        width: 120,
        topBottom: 0,
      },
      mark: {
        name: 'Note /20',
        histo: 'ordinal',
        encoding: 'BAR',
        formatter: this.markFormatter,
        width: 120,
        topBottom: 0,
      },
    };
  }

  ngOnDestroy (): void {
  }

  @Input()
  set evaluationsData ( value ) {
    this.evaluationsData$.next( value );
  }

  get evaluationsData () {
    return this.evaluationsData$.getValue();
  }

  get evalNameColors () {
    const evalNames = uniq( map( this.evaluationsData, 'evaluationName' ));
    const colorScheme = scaleOrdinal( schemeCategory10 ).domain( evalNames );
    return reduce( evalNames, ( acc, key ) => ({ ...acc, [key]: colorScheme( key ) }), {});
  }

  timeFormatter ( time ) {
    // replace mins in min because the moment add the letter 's' automatic.
    return moment.duration( time, 'minutes' ).format( 'h [h] mm [min]' ).replace( 'mins', 'min' );
  }

  markFormatter ( mark ) {
    return isNil( mark ) ? '' : mark;
  }

  scoreFormatter ( score ) {
    return score + '%';
  }
}

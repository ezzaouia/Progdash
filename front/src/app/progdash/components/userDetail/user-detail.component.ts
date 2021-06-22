import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  AfterContentInit
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { each, get, set, last, split, keys, startsWith } from 'lodash';
import { InfoWidgetComponent } from '../infoWidget';
import { UserTimelineWidgetComponent } from '../userTimelineWidget';
import { TopNRulesWidgetComponent } from '../topNRulesWidget';

/* tslint:disable component-selector  */
@Component({
  selector: 'UserDetail',
  template: `
  <div
    #containerRef
    id="learner-report"
    class="container">
    <div class="header">
      <h3>{{ user.fullName }}</h3>

      <span class="fill"></span>

      <button
        class="fab-button mat-32 skip-print"
        mat-button
        (click)="hotPrintWidgetHandler.emit( 'learner-report' )">
          <mat-icon>print</mat-icon>
      </button>

      <button
        class="fab-button mat-32 skip-print"
        mat-stroked-button
        (click)="onCloseClick()">
          <mat-icon aria-label="menu">close</mat-icon>
      </button>
    </div>

    <div class="grid"
      data-simplebar
      data-simplebar-auto-hide="false">
        <mat-grid-list cols="12" rowHeight="60px" gutterSize="10px">
        <mat-grid-tile
          mat-elevation-z1
          *ngFor="let key of boardGridElements"
          [colspan]="boardGrid[key].grid.cols"
          [rowspan]="boardGrid[key].grid.rows"
          (mouseenter)="hoverWidgetTraceHandler.emit({
            event: 'mouseenter', id: 'learner-' + key
          })"
          (mouseleave)="hoverWidgetTraceHandler.emit({
              event: 'mouseleave', id: 'learner-' + key
          })">

            <ndc-dynamic
              [ndcDynamicComponent]="boardGrid[key].component"
              [ndcDynamicInputs]="boardGrid[key].data">
            </ndc-dynamic>

        </mat-grid-tile>
      </mat-grid-list>
    </div>

  </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
      #learner-report {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .header {
        display: flex;
        width: 100%;
        height: 46px;
        z-index: 1001;
      }
      .grid {
        box-sizing: border-box;
        width: 100%; /*calc(100vw - 300px);*/
        height: calc(100% - 46px);
      }
      mat-grid-list {
        margin: 20px;
      }
      mat-grid-tile {
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),
        0 1px 1px 0 rgba(0,0,0,.14),
        0 1px 3px 0 rgba(0,0,0,.12);
      }
    `,
  ],
})
export class UserDetailComponent implements OnInit, AfterContentInit {
  @ViewChild( 'containerRef' ) elRef: ElementRef;

  @Input() user;
  @Input() modulesData;

  @Output() hoverWidgetTraceHandler = new EventEmitter();
  @Output() hotPrintWidgetHandler = new EventEmitter();

  offsetWidh;
  boardGrid;
  offsetWidth;
  boardGridElements;
  marginOffset = 125;

  constructor ( public dialogRef: MatDialogRef<UserDetailComponent> ) {}

  ngOnInit (): void { }

  ngAfterContentInit (): void {
    this.offsetWidth = this.elRef.nativeElement.offsetWidth - this.marginOffset;

    this.boardGrid = {
      score: {
        grid: { cols: 4, rows: 2, y: 0, x: 0 },
        component: InfoWidgetComponent,
        data: {
          title: 'Règles acquises',
          infoLabel: '',
        },
      },
      time: {
        grid: { cols: 4, rows: 2, y: 0, x: 4 },
        component: InfoWidgetComponent,
        data: {
          title: 'Temps d’entrainement',
          infoLabel: '',
        },
      },
      initialLevel: {
        grid: { cols: 4, rows: 2, y: 0, x: 8 },
        component: InfoWidgetComponent,
        data: {
          title: 'Règles sues initialement',
          infoLabel: '',
        },
      },
      progData: {
        grid: { cols: 3 * 4, rows: 5, y: 2, x: 0 },
        component: UserTimelineWidgetComponent,
        data: {
          title: 'Progression dans le temps',
        },
      },
      'topNRules.focused': {
        grid: { cols: 4, rows: 6, y: 7, x: 0 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Les règles les plus difficiles en cours d’apprentissage',
        },
      },
      'topNRules.acquired': {
        grid: { cols: 4, rows: 6, y: 7, x: 4 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Les règles acquises les plus difficiles',
        },
      },
      'topNRules.known': {
        grid: { cols: 4, rows: 6, y: 7, x: 8 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Exemples de règles sues initialement',
        },
      },
    };

    each( this.boardGrid, ( value, key ) => {
      let data;
      if ( key === 'time' ) {
        data = { sum: get( this.user, key ) };
      } else if ( startsWith( key, 'topNRules' )) {
        data = { data: get( this.user, key ) };
      } else {
        data = get( this.user, key );
      }

      set( value, 'data', {
        ...value.data,
        ...data,
        key: last( split( key, '.' )),
        offsetWidth: this.offsetWidth,
        userData: this.user,
        modulesData: this.modulesData,
        isPVLive: false,
      });
    });

    this.boardGridElements = keys( this.boardGrid );

    console.log( '=========== this.boardGrid', this.boardGrid );

  }

  onCloseClick (): void {
    this.dialogRef.close();
  }

}

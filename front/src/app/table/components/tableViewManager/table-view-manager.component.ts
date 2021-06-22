import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, merge, Subscription } from 'rxjs';
import {
  size,
  map,
  mapValues,
  get,
  sum,
  pick,
  values,
  uniq,
  has,
  flatMap,
  maxBy
} from 'lodash';
import { max, extent } from 'd3';

import { dayParseTime } from 'src/app/utils/chart.util';

export enum RowTableMode {
  NORMAL = 'NORMAL',
  OVERVIEW = 'OVERVIEW',
  TOPBOTTOM = 'TOPBOTTOM',
  CATFOCUS = 'CATFOCUS',
}

/* tslint:disable component-selector  */
@Component({
  selector: 'TableViewManager',
  template: `
    <CdkTableView
      *ngIf="isDone && (tableMode === 'normal')"
      [data]="data"
      [columns]="displayedColumns"
      [options]="options"
      [colDefaultHeight]="colDefaultHeight"
      [isStartPrintReport]="isStartPrintReport"
      [selectedWidgets]="selectedWidgets"
      (checkWidgetHandler)="checkWidgetHandler.emit($event)"
      (sortColumnTraceHandler)="sortColumnTraceHandler.emit($event)"
      (filterColumnTraceHandler)="filterColumnTraceHandler.emit($event)"
      (userMoreMenuHandler)="userMoreMenuHandler.emit($event)">
    </CdkTableView>

    <CdkMColTableView
      *ngIf="isDone && (tableMode === 'ranking')"
      [data]="data"
      [columns]="displayedColumns"
      [options]="options"
      [colDefaultHeight]="colDefaultHeight">
    </CdkMColTableView>
  `,
  styles: [
    `
      :host {
        width: fit-content;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class TableViewManagerComponent
  implements OnInit, OnDestroy, AfterViewInit {
  // @Input() columns;
  // @Input() data?;
  // @Input() options;
  @Input() colDefaultWidth;
  @Input() colDefaultHeight;
  @Input() tableMode;

  @Input() isStartPrintReport;
  @Input() selectedWidgets: string[];
  @Output() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();
  @Output() sortColumnTraceHandler = new EventEmitter();
  @Output() filterColumnTraceHandler = new EventEmitter();
  @Output() userMoreMenuHandler = new EventEmitter();

  options$ = new BehaviorSubject<any>({});
  data$ = new BehaviorSubject<any>([]);
  columns$ = new BehaviorSubject<{}>({});

  updateSub: Subscription;
  update$ = merge( this.data$, this.columns$, this.options$ );

  isDone = false;
  displayedColumns;
  cellMargin = 0;

  constructor () {}

  ngOnInit (): void {
    this.updateSub = this.update$
      .subscribe( _ => {
        this.displayedColumns = this.getDisplayedColumns( this.data );
        this.isDone = true;
      });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  ngAfterViewInit () {}

  getDisplayedColumns ( data ) {
    let encoding = '',
      xextent = [],
      yextent = [],
      range = [],
      yrange = [],
      keys = [];
    return mapValues( this.columns, ( d, col ) => {
      encoding = get( d, 'encoding' );
      // to handle first
      if ( !has( d, 'topBottom' )) {
        d['topBottom'] = 1;
      }
      if ( !has( d, 'width' )) {
        d['width'] = this.colDefaultWidth;
      }
      if ( !has( d, 'height' )) {
        d['height'] = this.colDefaultHeight;
      }
      if ( !has( d, 'header' )) {
        d['header'] = true;
      }

      if (
        encoding === 'BAR' ||
        encoding === 'DOT' ||
        encoding === 'STACK'
      ) {
        xextent = [ 0, max( map( data, col )) ];
        range = [ this.cellMargin, d['width'] - this.cellMargin ];
      } else if ( encoding === 'CAT' || encoding === 'MCAT' ) {
        keys = uniq( flatMap( data, col ));
        d['keys'] = keys;
      } else if ( encoding === 'LINE' ) {
        const x = get( d, 'xkey', 'x' );
        const y = get( d, 'ykey', 'y' );

        if ( get( d, 'scaleType' ) === 'time' ) {
          xextent = extent( flatMap( data, col ), dd => new Date( dayParseTime( get( dd, x ))));
        } else {
          xextent = [ 0, get ( maxBy( flatMap( data, col ), x ), x ) ];
        }

        yextent = [ 0, get ( maxBy( flatMap( data, col ), y ), y ) ];
        range = [ this.cellMargin, d['width'] - this.cellMargin ];
        yrange = [ d['height'] - this.cellMargin, this.cellMargin ];

        d['yextent'] = yextent;
        d['yrange'] = yrange;
      }

      d['extent'] = xextent;
      d['range'] = range;
      return d;
    });
  }

  @Input()
  get data () {
    return this.data$.getValue();
  }

  set data ( value ) {
    this.data$.next( value );
  }

  @Input()
  get columns () {
    return this.columns$.getValue();
  }

  set columns ( value ) {
    this.columns$.next( value );
  }

  @Input()
  get options () {
    return this.options$.getValue();
  }

  set options ( value ) {
    this.options$.next( value );
  }
}

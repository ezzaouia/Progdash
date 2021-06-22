import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject, merge, of, from } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { flatMap, get } from 'lodash';
import { scaleLinear, scaleTime, extent, scaleOrdinal, max, select, timeMonth } from 'd3';
import * as moment from 'moment';
import 'moment-duration-format';
moment.locale( 'fr' );

import { ChartTimeScale, colors } from '../../../utils/chart.util';
import { InteractionsService } from '../../../shared/services';


/* tslint:disable component-selector  */
@Component({
  selector: 'MlineChart',
  template: `
      <svg
          #svg
          id="svg-mline-chart"
          class="no-select"
          preserveAspectRatio="xMidYMid meet">
        <g Axis
            [position]="'bottom'"
            [scale]="xScale"
            [transform]="[30, height - margin]"
            [class]="'axis-x'"
            [ticks]="xTicks"
            [format]="xTicksFormat"
            [xRotate]="-20"
            [range]="xRange"
            [domain]="xDomain">
        </g>
        <g Axis
            [position]="'left'"
            [scale]="yScale"
            [transform]="[margin + 30, 0]"
            [class]="'axis-y'"
            [ticks]="yTicks"
            [tickValues]="[]"
            [range]="yRange"
            [domain]="yDomain">
        </g>
        <g Mline
            [width]="width"
            [height]="height"
            [data]="data"
            [modulesData]="modulesData"
            [ykey]="ykey"
            [xScale]="xScale"
            [yScale]="yScale"
            [cScale]="cScale"
            [timeScale]="timeScale"
            [margin]="margin"
            [xlabel]="''"
            [ylabel]="'Nombre de règles acquises'"
            [timeParse]="timeParse"
            [class]="'line'"
            [transform]="[30, 0]"
            [range]="xRange"
            [domain]="xDomain">
        </g>
      </svg>
  `,
  styles: [ `
    :host {
      display: block;
    }
  }
  ` ],
})
export class MlineChartComponent implements OnInit, OnDestroy {

  @ViewChild( 'svg' ) svgRef: ElementRef;

  @Input() modulesData: {};
  @Input() width;
  @Input() height;

  margin = 40;
  userLegendMargin = 0;

  xDomain;
  yDomain;
  xRange;
  yRange;
  timeTick;
  timeParse;
  timeFormat;
  xTicksFormat;
  xTicks;
  yTicks;

  datum = [];
  updateSub = null;
  updateTimer = undefined;

  rangeFilter$ = this.interactionService.rangeFilter$;
  data$ = new BehaviorSubject<any>({});
  ykey$ = new BehaviorSubject<string>( 'score' );
  timeScale$ = new BehaviorSubject<string>( ChartTimeScale.Week );

  updateSub$ = merge(
    this.data$,
    this.ykey$,
    this.timeScale$,
    this.rangeFilter$
  );

  cScale: any = scaleOrdinal().range( colors );
  xScale = scaleTime().range([ this.margin, this.width - 30 - this.userLegendMargin ]); // .nice();
  yScale = scaleLinear().range([ this.height - this.margin, this.margin ]).nice();

  constructor ( private interactionService: InteractionsService ) { }

  ngOnInit (): void {

    select( this.svgRef.nativeElement )
    .attr( 'viewBox', `0 0 ${ this.width + 10} ${ this.height }` );

    this.updateSub = this.updateSub$
      .pipe( debounceTime( 300 ))
      .subscribe( _ => {
        if ( !this.data ) { return; }
        this.updateHandler();
      });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  updateHandler () {

    this.xTicks = timeMonth.every( 1 );
    this.timeParse = this.momentTimeParse;
    this.xTicksFormat = this.momentTimeFormat;
    const { yextent } = this.calExtent();

    // DO NOT KEEP IT LIKE THAT: hard coded here for the experiment,
    this.xDomain = [ new Date( '2018-08-25' ), new Date( '2019-06-15' ) ];
    this.yDomain = yextent;
    this.xRange = [ this.margin, this.width - 30 - this.userLegendMargin ];
    this.yRange = [ this.height - this.margin, this.margin ];

    this.xScale.domain( this.xDomain );
    this.xScale.range( this.xRange );
    this.yScale.range( this.yRange );
  }

  momentTimeFormat ( d ) {
    return moment( d ).format( 'DD/MM/YY' );
  }

  momentTimeParse ( d ) {
    return moment( d );
  }

  get rangeFilter () {
    return this.rangeFilter$.getValue();
  }

  @Input()
  set data ( value ) {
    this.data$.next( value );
  }

  get data () {
    return this.data$.getValue();
  }

  @Input()
  set ykey ( value ) {
    this.ykey$.next( value );
  }

  get ykey () {
    return this.ykey$.getValue();
  }

  @Input()
  set timeScale ( value ) {
    this.timeScale$.next( value );
  }

  get timeScale () {
    return this.timeScale$.getValue();
  }

  calExtent () {
    const data = flatMap( this.data, 'progData' );
    const xextent = extent( data, d => new Date( get( d, 'date', '' )));
    const yextent = [ 0, max( data, d => get ( d, this.ykey )) ];
    return { xextent, yextent };
  }
}


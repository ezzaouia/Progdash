import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { size, map, countBy, each, flatMap, toNumber, round } from 'lodash';
import { scaleLinear, histogram, extent, max, select } from 'd3';
import * as moment from 'moment';
import 'moment-duration-format';
import { debounceTime } from 'rxjs/operators';
moment.locale( 'fr' );

/* tslint:disable component-selector  */
@Component({
  selector: 'HistogramChart',
  template: `
    <svg #svg class="no-select"
      [attr.width]="width"
      [attr.height]="height">
      <g
        *ngIf="width"
        Axis
        [position]="'bottom'"
        [scale]="xScale"
        [transform]="[0, height - margin]"
        [class]="'histo-filter-axis-x'"
        [format]="format"
        [tickValues]="(type === 'categorical' ? [] : tickValues)"
        [range]="xRange"
        [domain]="xDomain">
      </g>
      <g
        *ngIf="width"
        Histogram
        [data]="datum"
        [ykey]="ykey"
        [type]="type"
        [options]="options"
        [margin]="margin"
        [xScale]="xScale"
        [yScale]="yScale"
        (updateRangeFilter)="updateRangeFilter.emit($event)">
      </g>
  </svg>
  `,
  styles: [ `
    svg.g.tick {
      font-size: 10px;
      font-weight: 500;
    }
  ` ],
})
export class HistogramChartComponent implements OnInit, OnDestroy {
  @ViewChild( 'svg' ) elRef: ElementRef;

  @Input() ykey;
  @Input() options?;
  @Output() updateRangeFilter ? = new EventEmitter();
  @Input() type?: 'ordinal' | 'categorical' = this.type || 'ordinal';
  @Input() width; // this.width || get( this.chrtFrmt, 'width' );
  @Input() height ? = 60; // this.height || get( this.chrtFrmt, 'height' );
  @Input() margin ? = 18; // this.margin || get( this.chrtFrmt, 'margin' );

  datum;
  xDomain;
  yDomain;
  tickValues;
  format;
  updateSub;
  xRange;
  yRange;
  xScale = scaleLinear();
  yScale = scaleLinear();

  data$ = new BehaviorSubject<any[]>([]);
  width$ = new BehaviorSubject<any[]>([]);
  update$ = merge( this.data$ );

  constructor () { }

  ngOnInit (): void {
    this.updateSub = this.update$
      .subscribe( _ => {
        this.update();
      });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  update () {
    if ( this.type === 'categorical' ) {
      this.datum = this.buildCategoricalDatum( this.data, this.xScale, this.ykey );
    } else if ( this.type === 'ordinal' ) {
      this.datum = this.buildOrdinalDatum( this.data, this.xScale, this.ykey );
    } else {
      select( this.elRef.nativeElement ).remove();
      return;
    }

    if ( this.ykey === 'time' ) {
      this.format = this.timeFormat;
    } else {
      this.format = this.numberFormat;
    }

    this.xRange = [ this.margin, this.width - this.margin ];
    this.yRange = [ this.height - this.margin, this.margin ];

    this.tickValues = this.xDomain;
    this.xScale.domain( this.xDomain );
    this.xScale.range( this.xRange );
    this.yScale.domain( this.yDomain );
    this.yScale.range( this.yRange );
  }

  buildOrdinalDatum ( data, scale, key ) {
    const d: any[] = map( data, key );

    this.xDomain = extent( d );

    scale.domain( this.xDomain ).nice( size( d ));

    const bands = histogram()
            .domain( this.xDomain )
            .value( dd => dd )
            .thresholds( scale.ticks( 10 ))( d );

    this.yDomain = [ 0, max( bands, ( dd: any ) => dd.length ) ];

    return bands;
  }

  buildCategoricalDatum ( data, scale, key ) {
    let d: any = flatMap( data, key ), index = 0, bandWidth = 0, e = [];

    d = countBy( d );
    bandWidth = scale.range()[1] - scale.range()[0];
    bandWidth = bandWidth / size( d );
    this.xDomain = [ 0, scale.range()[1] - scale.range()[0] ];
    scale.domain( this.xDomain );

    const bands = [];
    each( d, ( v, k ) => {
      e = [];
      e['length'] = v;
      e['key'] = k;
      e['x0'] = index * bandWidth;
      e['x1'] = ( index + 1 ) * bandWidth;
      bands.push( e );
      index++;
    });

    this.yDomain = [ 0, max( bands, ( dd: any ) => dd.length ) ];

    return bands;
  }

  @Input()
  set data ( value ) {
    this.data$.next( value );
  }

  get data () {
    return this.data$.getValue();
  }

  timeFormat ( time ) {
    return moment.duration( time, 'minutes' ).format( 'h:mm' );
  }

  numberFormat ( val ) {
    const v = toNumber( val );
    return isNaN( v ) ? '' : v;
  }

  // @Input()
  // set width ( value ) {
  //   this.width$.next( value );
  // }

  // get width () {
  //   return this.width$.getValue();
  // }
}


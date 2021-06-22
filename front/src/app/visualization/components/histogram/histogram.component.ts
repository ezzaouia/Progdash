import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { select, event, max, drag, scaleOrdinal } from 'd3';
import { get } from 'lodash';

import { InteractionsService } from '../../../shared/services';
import { colors } from '../../../utils/chart.util';

/* tslint:disable component-selector  */
@Component({
  selector: '[Histogram]',
  template: `<svg:g #group></svg:g>`,
})
export class HistogramComponent implements OnInit, OnDestroy {
  @ViewChild( 'group' ) elRef: ElementRef;

  @Input() xScale: any;
  @Input() ykey: any;
  @Output() updateRangeFilter = new EventEmitter();
  @Input() type: any;
  @Input() yScale: any;
  @Input() margin: any;
  @Input() class?: string;
  @Input() options?: string;

  catFilter = {};
  updateSub;
  cScale: any = scaleOrdinal().range( colors );
  data$ = new BehaviorSubject<any>({});
  rangeFilter$ = this.interactionService.rangeFilter$;
  update$ = merge( this.data$ );

  constructor ( private interactionService: InteractionsService ) { }

  ngOnInit (): void {
    this.onInit();
    this.updateSub = this.update$
    .pipe( debounceTime( 100 ))
    .subscribe( _ => {
      this.onRender();
    });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  onInit () {
    select( this.elRef.nativeElement )
      .append( 'g' )
      .attr( 'class', `group--line ${this.class}` );
  }

  onRender () {
    this.render();
  }

  render () {
    if ( !this.data ) { return; }

    const el = select( this.elRef.nativeElement )
      .select( '.group--line' );

    this.yScale.domain([ 0, max( this.data, ( d: any ) => d.length ) ]);

    if ( this.type === 'categorical' ) {
      this.renderHistogramShadow( el );
    }

    this.renderHistogram( el );

    if ( this.type === 'ordinal' ) {
      this.renderSlider( el );
    }

  }

  renderHistogram ( el ) {
    const self = this;
    const histsInkEl = el
      .selectAll( '.hists-ink--el' )
      .data( this.data );

    histsInkEl
      .exit()
      .remove();

    histsInkEl
      .enter()
      .append( 'rect' )
      .merge( histsInkEl )
      .style( 'fill', ( d, i ) => ( this.type === 'ordinal' ) ?
        '#ccc' : get ( this.options, `color.${ d.key }`, this.cScale( i ))
      )
      .attr( 'class', ( _, i ) => `hists-ink--el ink-id--${i}` )
      .attr( 'x', d => this.xScale( d.x0 ) + 1 )
      .attr( 'y', d => this.yScale( d.length ))
      .attr( 'width', d => Math.max( 0, this.xScale( d.x1 ) - this.xScale( d.x0 ) - 1 ))
      .attr( 'height', d => this.yScale( 0 ) - this.yScale( d.length ))
      .on( 'mouseenter', self.type === 'categorical' ?
        this.onMouseenterCatAttr.bind( this, el ) : null
      )
      .on( 'mouseleave', self.type === 'categorical' ?
        this.onMouseleaveCatAttr.bind( this, el ) : null
      )
      .on( 'click', self.type === 'categorical' ?
        this.onClickCatAttr.bind( this, el ) : null
      );
  }

  renderHistogramShadow ( el ) {
    const self = this;
    const histsInkEl = el
      .selectAll( '.hists-shadow--el' )
      .data( this.data );

    histsInkEl
      .exit()
      .remove();

    histsInkEl
      .enter()
      .append( 'rect' )
      .merge( histsInkEl )
      .style( 'fill', '#eee' )
      .attr( 'class', ( _, i ) => `hists-shadow--el shadow-id--${i}` )
      .attr( 'x', d => this.xScale( d.x0 ) + 1 )
      .attr( 'y', d => this.yScale.range[1])
      .attr( 'width', d => Math.max( 0, this.xScale( d.x1 ) - this.xScale( d.x0 ) - 1 ))
      .attr( 'height', d => this.yScale( 0 ))
      .on( 'mouseenter', self.type === 'categorical' ?
        this.onMouseenterCatAttr.bind( this, el ) : null
      )
      .on( 'mouseleave', self.type === 'categorical' ?
        this.onMouseleaveCatAttr.bind( this, el ) : null
      )
      .on( 'click', self.type === 'categorical' ?
        this.onClickCatAttr.bind( this, el ) : null
      );
  }

  onMouseenterCatAttr ( el, _, i ) {
    el.select( `.shadow-id--${i}` )
    .style( 'stroke',  '#777' )
    .style( 'stroke-width',  1 );
  }

  onMouseleaveCatAttr ( el, d, i ) {
    el.select( `.shadow-id--${i}` )
    .style( 'stroke',  this.catFilter[d.key] ? 'blue' : 'none' );
  }

  onClickCatAttr ( el, d, i ) {
    this.catFilter[d.key] = !!!this.catFilter[d.key];
    this.updateRangeFilterValues( this.ykey, this.catFilter[d.key] ? d.key : '' );
    el.selectAll( `.hists-shadow--el` )
     .style( 'stroke',  'none' );

    if ( this.catFilter[this.ykey]) {
      el.select( `.shadow-id--${i}` )
        .style( 'stroke',  'blue' );
    }
  }

  renderSlider ( el ) {
    const self = this;
    const epsilon = 2;
    this.xScale.clamp( true );
    let xFirstHead = this.xScale.domain()[0],
      xSecondHead = this.xScale.domain()[1],
      headToMove = null;

    el
      .select( '.slider' )
      .remove();

    const sliderEl = el
      .append( 'g' )
      .attr( 'class', 'slider' );

    sliderEl
      .append( 'line' )
      .style( 'stroke', '#777' )
      .style( 'stroke-linecap', 'round' )
      .style( 'stroke-width', 3 )
      .attr( 'x1', this.xScale.range()[0])
      .attr( 'x2', this.xScale.range()[1])
      .attr( 'y1', this.yScale.range()[0])
      .attr( 'y2', this.yScale.range()[0])
      .select( function () { return this.parentNode.appendChild( this.cloneNode( true )); })
      .style( 'stroke', 'transparent' )
      .style( 'stroke-width', 10 )
      .style( 'pointer-events', 'stroke' )
      .call( drag()
        .on( 'start.interrupt', function () {
          const x = self.xScale.invert( event.x );
          headToMove = ( Math.abs( x - xFirstHead ) < Math.abs( x - xSecondHead )) ?
            'first-head' : 'second-head';
          sliderEl.interrupt();
        })
        .on( 'start drag', function () {
          handleGrag( self.xScale.invert( event.x ));
        })
        .on( 'end', function () {
          xFirstHead = getHeadPosition( 'first-head' );
          xSecondHead = getHeadPosition( 'second-head' );
        }));

    const firstHead = sliderEl
      .append( 'circle' )
      .attr( 'cx', this.xScale.range()[0])
      .attr( 'cy', this.yScale.range()[0])
      .attr( 'r', 5 )
      .attr( 'class', 'first-head' )
      .style( 'pointer-events', 'none' )
      .style( 'fill', '#777' );

    const secondHead = sliderEl
      .append( 'circle' )
      .attr( 'cx', this.xScale.range()[1])
      .attr( 'cy', this.yScale.range()[0])
      .attr( 'r', 5 )
      .style( 'fill', '#777' )
      .style( 'pointer-events', 'none' )
      .attr( 'class', 'second-head' );

    const handleGrag = ( x ) => {
      // We only move one head at a time.
      // firstHead is always < secondHead.
      if (( headToMove === 'first-head' && Math.abs( x - xSecondHead ) <= epsilon )
        || ( headToMove === 'second-head' && Math.abs( xFirstHead - x ) <= epsilon )) {
        return;
      }
      setHeadPosition( headToMove, x );
      // Update rangeFilter
      self.updateRangeFilterValues(
        this.ykey,
        [ getHeadPosition( 'first-head' ), getHeadPosition( 'second-head' ) ]
      );
    };

    const getHeadPosition = ( head ) => {
      return self.xScale.invert( el.select( '.' + head ).attr( 'cx' ));
    };

    const setHeadPosition = ( head, x ) => {
      el.select( '.' + head ).attr( 'cx', self.xScale( x ));
    };
  }

  updateRangeFilterValues ( key, value ) {
    this.updateRangeFilter.emit({ [key]: value });
    this.rangeFilter$.next({ [key]: value });
  }

  @Input()
  set data ( value ) {
    this.data$.next( value );
  }

  get data () {
    return this.data$.getValue();
  }

}

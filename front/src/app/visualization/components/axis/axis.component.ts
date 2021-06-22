import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  axisBottom,
  axisLeft,
  axisTop,
  axisRight,
  select,
  easeLinear
} from 'd3';
import { BehaviorSubject, merge } from 'rxjs';

/* tslint:disable component-selector  */
@Component({
  selector: '[Axis]',
  template: `
    <svg:g #group></svg:g>
  `,
  styles: [ `` ],
})
export class AxisComponent implements OnInit, OnDestroy {
  @ViewChild( 'group' ) elRef: ElementRef;

  @Input() scale: any;
  @Input() extent?: any;
  @Input() position: 'left' | 'right' | 'bottom' | 'top';
  @Input() class?: string;
  @Input() transform?: number[] = [ 0, 0 ];
  // @Input() tickSize?: number[];
  @Input() ticks?: number[];
  @Input() xRotate?: number;
  @Input() tickValues?: any[];
  @Input() format?: number[];

  axis;
  range$ = new BehaviorSubject<any>( null );
  domain$ = new BehaviorSubject<any>( null );
  tickSize$ = new BehaviorSubject<any>( null );
  update$ = merge( this.range$, this.domain$, this.tickSize$ );
  updateSub = null;

  constructor () { }

  ngOnInit () {
    this.onInit();
    this.updateSub = this.update$.subscribe( _ => {
      this.onUpdate();
    });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  onInit () {
    switch ( this.position ) {
      case 'left': {
        this.axis = axisLeft( this.scale );
        break;
      }
      case 'right': {
        this.axis = axisRight( this.scale );
        break;
      }
      case 'bottom': {
        this.axis = axisBottom( this.scale );
        break;
      }
      case 'top': {
        this.axis = axisTop( this.scale );
        break;
      }
      default: break;
    }

    if ( this.ticks ) { this.axis.ticks( this.ticks ); }
    if ( this.format ) { this.axis.tickFormat( this.format ); }
    if ( this.tickSize ) { this.axis.tickSize( ...this.tickSize ); }
    if ( this.tickValues ) { this.axis.tickValues( this.tickValues ); }

    select( this.elRef.nativeElement )
      .append( 'g' )
      .attr( 'class', `axis ${this.class} ` );

      this.Update();
  }

  onUpdate () {
    this.Update();
  }

  Update () {
    try {
      if ( this.ticks ) { this.axis.ticks( this.ticks ); }
      if ( this.format ) { this.axis.tickFormat( this.format ); }
      if ( this.tickSize ) { this.axis.tickSize( ...this.tickSize ); }

    const axis = select( this.elRef.nativeElement )
      .selectAll( `.${this.class}` )
        .attr( 'transform',
          `translate( ${this.transform[0]}, ${this.transform[1]})`
        )
        .transition()
        .duration( 200 )
        .ease( easeLinear )
        .call( this.axis );

      // if ( this.xRotate ) {
        axis
          .selectAll( '.axis-x text' )
          .attr( 'y', 0 )
          .attr( 'x', -9 )
          .attr( 'dy', -9 )
          .attr( 'transform', 'rotate(-20) translate(-30, 30)' )
          .attr( 'font-size', 13 )
          .attr( 'font-family', 'sans-serif' )
          .style( 'text-anchor', 'start' );
      // }
    } catch ( error ) { }
  }

  @Input()
  set range ( value ) {
    this.range$.next( value );
  }

  get range () {
    return this.range$.getValue();
  }

  @Input()
  set domain ( value ) {
    this.domain$.next( value );
  }

  get domain () {
    return this.domain$.getValue();
  }

  @Input()
  set tickSize ( value ) {
    this.tickSize$.next( value );
  }

  get tickSize () {
    return this.tickSize$.getValue();
  }

}






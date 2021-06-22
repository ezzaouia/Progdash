import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { line, curveMonotoneX, select } from 'd3';
import { BehaviorSubject, Subscription } from 'rxjs';
import { snakeCase } from 'lodash';
import { InteractionsService } from 'src/app/shared/services';

/* tslint:disable component-selector  */
@Component({
  selector: 'SlopLink',
  template: `
    <svg
      #svg
      [attr.width]="width"
      [attr.height]="height">
    </svg>
  `,
  styles: [ `
    svg {
      padding: 0 2px;
    }
  ` ],
})
export class SlopLinkComponent implements OnInit, OnDestroy {
  @ViewChild( 'svg' ) elRef: ElementRef;

  @Input() width;
  @Input() height;

  highlightSub: Subscription;
  updateSub: Subscription;
  data$ = new BehaviorSubject([]);
  highlight$ = this.interactionsService.highlight$;

  line = line()
    .curve( curveMonotoneX )
    .x(( d: any ) => d[0])
    .y(( d: any ) => d[2] ? ( d[1] * d[2] + d[2] / 2 ) : d[1]);

  constructor (
    private interactionsService: InteractionsService
  ) { }

  ngOnInit (): void {

    this.updateSub = this.data$
      .subscribe( _ => {
        this.render();
      });

    this.highlightSub = this.highlight$
      .subscribe( h => {
        this.handleHighlight( h );
      });

  }

  ngOnDestroy () {
    this.updateSub.unsubscribe();
    this.highlightSub.unsubscribe();
  }

  render () {

    if ( !this.data ) {
      console.log( 'data is null' );
      return;
    }

    const lines = select( this.elRef.nativeElement )
      .selectAll( '.links' )
      .data( this.data, d =>  d.id );

    lines
      .enter()
      .append( 'path' )
      .merge( lines )
      .attr( 'class', d => 'links ink id--' + d.id )
      .attr( 'd', d => this.line( d ))
      .style( 'fill', 'none' )
      .style( 'stroke', '#777' )
      .style( 'stroke-opacity', 0.5 )
      .style( 'stroke-width', 1 );

    lines
      .exit()
      .remove();

  }

  handleHighlight ( h ) {
    if ( h.id ) {
      select( this.elRef.nativeElement ).selectAll( '.ink' ).style( 'opacity', 0.1 );
      select( this.elRef.nativeElement )
        .select( `.ink.id--${snakeCase( h.id )}` )
        .style( 'opacity', 1 )
        .style( 'stroke', '#7e3ff2' )
        .style( 'stroke-width', 2 );

    } else {
      select( this.elRef.nativeElement )
        .selectAll( '.ink' )
        .style( 'opacity', 0.5 )
        .style( 'stroke', '#777' )
        .style( 'stroke-width', 1 );
    }
  }

  get data () {
    return this.data$.getValue();
  }

  @Input()
  set data ( value ) {
    this.data$.next( value );
  }

}

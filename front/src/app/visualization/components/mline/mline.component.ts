import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { get, each, truncate, map } from 'lodash';
import {
  line,
  select,
  curveMonotoneX,
  interpolateString,
  scaleLinear,
  transition,
} from 'd3';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InteractionsService } from '../../../shared/services';

@Component({
  /* tslint:disable component-selector  */
  selector: '[Mline]',
  template: `<svg:g #group></svg:g>`,
})
export class MlineComponent implements OnInit, OnDestroy {
  @ViewChild( 'group' ) elRef: ElementRef;

  @Input() class?: string;
  @Input() xScale: any;
  @Input() yScale: any;
  @Input() cScale: any;
  @Input() timeParse: any;
  @Input() margin?: any;
  @Input() width?: any;
  @Input() height?: any;
  @Input() xlabel?: any;
  @Input() ylabel?: any;
  @Input() transform?: number[] = [ 0, 0 ];
  @Input() modulesData: any;

  circleAttrExtent;
  sSumOfTopRules;
  transition = transition().duration( 500 ).ease();
  data$ = new BehaviorSubject<any[]>([]);
  ykey$ = new BehaviorSubject<string>( '' );
  range$ = new BehaviorSubject<any>( null );
  domain$ = new BehaviorSubject<any>( null );
  timeScale$ = new BehaviorSubject<string>( '' );

  updateSub;
  highlightSub = Subscription;
  highlight$ = this.interactionsService.highlight$;
  update$ = merge( this.data$, this.ykey$, this.range$, this.domain$, this.timeScale$ );
  mdlScale: any = scaleLinear();
  line = line()
    .curve( curveMonotoneX )
    .x(( d: any ) => this.xScale( new Date( d.date )));

  @Input() intialEvalConfig;

  constructor ( private interactionsService: InteractionsService ) { }

  ngOnInit (): void {
    this.onInit();

    this.updateSub = this.update$
    .pipe( debounceTime( 300 ))
    .subscribe( _ => {
      if ( !this.data ) { return; }
      this.render();
    });

    this.highlight$.subscribe( h => {
       this.handleHighlight( h );
    });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  onInit () {
    select( this.elRef.nativeElement )
      .append( 'g' )
      .attr( 'class', `group--module ${this.class}` )
      .attr( 'transform',
        `translate(0, ${ this.margin })`
      );

    select( this.elRef.nativeElement )
      .append( 'g' )
      .attr( 'class', `group--line ${this.class}` )
      .attr( 'transform', `translate( ${this.transform[0]}, ${this.transform[1]} )` );

    this.sSumOfTopRules = this.initSSumOfTopRules();

    const nbrOfRules = get( this.modulesData, 'displayedNbrOfRules' );
    this.yScale.domain([ 0,  nbrOfRules ]);

    this.line
      .y( d =>
        this.yScale( get( d, this.ykey ))
      );

    this.renderModulesLabels();
  }

  render () {
    const el = select( this.elRef.nativeElement ).select( '.group--line' );
    this.renderDots( el );
    this.renderLines( el );
  }

  renderModulesLabels () {
    const el = select( this.elRef.nativeElement ).select( '.group--module' );
    const nbrOfRules = get( this.modulesData, 'displayedNbrOfRules' );
    const modules = get ( this.modulesData, 'forLabel' );

    const s = scaleLinear()
      .domain([ 0,  nbrOfRules ])
      .range([ this.height - 2 * this.margin , 0 ]);
    const st = scaleLinear()
      .domain([ 0, nbrOfRules ])
      .range([ 0, this.height - 2 * this.margin ]);
    const offset = 2;

    const rectsEl = el
      .selectAll( '.rects--el' )
      .data( modules, ( d: any ) => d.key );

    const rectsElEnter = rectsEl
      .enter()
      .append( 'g' )
      .merge( rectsEl )
      .attr( 'class', 'rects--el' );

    rectsElEnter
      .append( 'line' )
      .attr( 'class', ( d: any ) => 'line-upperband--el' + ' id--' + d );

    rectsElEnter
      .append( 'rect' )
      .attr( 'class', ( d: any ) => 'rect-range--el' + ' id--' + d );

    rectsElEnter
      .append( 'text' )
      .attr( 'class', ( d: any ) => 'text--el' + ' id--' + d );

    rectsElEnter
      .select( 'line.line-upperband--el' )
      .attr( 'x1', 5 )
      .attr( 'y1', ( d: any ) => s( get ( d, 'rSumOfTopRules' )))
      .attr( 'x2', this.width + this.margin )
      .attr( 'y2', ( d: any ) => s( get ( d, 'rSumOfTopRules' )))
      .style( 'stroke', '#ccc' )
      .style( 'stroke-width', 0.5 );

    rectsElEnter
      .select( 'text.text--el' )
      .attr( 'x', 15 )
      .attr( 'y', ( d: any ) => s( get( d, 'rSumOfTopRules' ) - get( d, 'nbrOfRules' ) / 2 ))
      .attr( 'class', 'text-label' )
      .attr( 'transform', ( d: any ) => `rotate(-50, 15,  ${
          s( get( d, 'rSumOfTopRules' ) - get( d, 'nbrOfRules' ) / 2 )
        }) translate(-25, 15)`
      )
      .attr( 'font-size', 11 )
      .attr( 'font-family', 'sans-serif' )
      .text( d => truncate(
        get ( d, 'key' ),
        { 'length': 10, omission: '.' }) + ` (${get( d, 'nbrOfRules' )})`
      );
  }

  renderLines ( el ) {
    const parent = select( this.elRef.nativeElement );
    const linesEl = el
    .selectAll( '.lines--el' )
    .data( this.data, ( d: any ) => d.id );

    // update scale.
    // this.yScale.domain([
    //   0, get( this.modulesData, 'displayedNbrOfRules' ),
    // ]).range([ this.height - 2 * this.margin , 0 ]);

    const linesElEnter = linesEl
      .enter()
      .append( 'g' )
      .merge( linesEl )
      .attr( 'class', ( d: any, _ ) => 'lines--el' );

    linesElEnter
      .append( 'path' )
      .attr( 'class', ( d: any, _ ) => 'line-ink--el ink' + ' id--' + d.id );

    linesElEnter
      .append( 'path' )
      .attr( 'class', ( d: any, _ ) =>
        'line-shadow--el shadow' + ' id--' + d.id
      );

    linesElEnter
      .select( 'path.line-ink--el' )
      .style( 'stroke', ( d: any ) => get ( this.modulesData, `forColor.${d.lastModule}` ))
      .style( 'stroke-width', 1.5 )
      .style( 'opacity', 0.9 )
      .style( 'fill', 'none' )
      .style( 'pointer-events', 'none' )
      .attr( 'd', ( d: any ) => this.line( get( d, 'progData', [])))
      .transition()
      .duration( 250 )
      .attrTween( 'stroke-dasharray', function () {
          const len = this.getTotalLength();
          return function ( t ) {
              return interpolateString( '0,' + len, len + ',' + len )( t );
          };
      });

    linesElEnter
      .select( 'path.line-shadow--el' )
      .style( 'stroke-width', 10 )
      .style( 'stroke', '#0005' )
      .style( 'stroke-linecap', 'round' )
      .style( 'opacity', 0 )
      .style( 'fill', 'none' )
      .style( 'pointer-events', 'auto' )
      .style( 'cursor', 'pointer' )
      .attr( 'd', ( d: any ) => this.line( get( d, 'progData', [])))
      .on( 'mouseenter', this.onMouseenter.bind( this, parent ))
      .on( 'mouseleave',  this.onMouseleave.bind( this, parent ))
      .on( 'click',  this.onClick.bind( this, parent ));

    linesEl
      .exit()
      .remove();

  }

  renderDots ( el ) {
    const dotsEl = el
    .selectAll( '.dots--el' )
    .data( this.data, ( d: any ) => d.id  );

  dotsEl
    .exit()
    .remove();

  const self = this;

  dotsEl
    .enter()
    .append( 'g' )
    .attr( 'class', 'dots--el'  )
    .merge( dotsEl )
    .attr( 'd' , function ( d: any, i ): any {
      const newSelf = select( this );

      each( get( d, 'progData', []), _ => {
        const circlesEl = newSelf
          .selectAll( '.circles--el' )
          .data( get( d, 'progData', []));

        circlesEl
          .exit()
          .remove();

        circlesEl
          .enter()
          .append( 'circle' )
          .merge( circlesEl )
          .attr( 'cx', ( dd: any ) => self.xScale( new Date( dd.date )))
          .attr( 'cy', ( dd: any ) =>
              self.yScale( get( dd, self.ykey ))
          )
          .attr( 'r', 2 )
          .attr( 'class', 'circles--el ink'  + ' id--' + d.id )
          .style( 'opacity', 0.9 )
          .style( 'fill', ( ) => get ( self.modulesData, `forColor.${d.lastModule}` ))
          .on( 'mouseenter', self.onMouseenter.bind( null, el, d ))
          .on( 'mouseleave',  self.onMouseleave.bind( null, el ))
          .on( 'click',  self.onClick.bind( null, el ));
      });
    });
  }

  handleHighlight ( h ) {
    if ( h.id ) {
      select( this.elRef.nativeElement ).selectAll( '.ink' ).style( 'opacity', 0.1 );
      select( this.elRef.nativeElement ).selectAll( '.shadow' ).style( 'opacity', 0 );
      select( this.elRef.nativeElement )
      .selectAll( `.ink.id--${h.id},.shadow.id--${h.id}` )
      .style( 'opacity', 1 );
    } else {
      select( this.elRef.nativeElement ).selectAll( '.shadow' ).style( 'opacity', 0 );
      select( this.elRef.nativeElement ).selectAll( '.ink' ).style( 'opacity', 0.9 );
    }
  }

  onMouseenter ( el, d ) {
    this.highlight$.next({ id: d.id });
    // el.selectAll( '.ink' ).style( 'opacity', 0.1 );
    // el.selectAll( `.ink.id--${d.id}` ).style( 'opacity', 1 );
  }

  onMouseleave ( el,  ) {
    this.highlight$.next({ id: '' });
    el.selectAll( '.ink' ).style( 'opacity', 0.9 );
  }

  onClick ( el, d ) {
    el.selectAll( '.shadow' ).style( 'opacity', 0 );
    el.select( `.shadow.id--${d.id}` ).style( 'opacity', 1 );
  }

  initSSumOfTopRules () {
    const o = {};
    each ( get( this.modulesData, 'forLine' ), e => {
      o[ get ( e, 'key' ) ] = get ( e, 'sSumOfTopRules' );
    });
    return o;
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
  set timeScale ( value ) {
    this.timeScale$.next( value );
  }

  get timeScale () {
    return this.timeScale$.getValue();
  }

}

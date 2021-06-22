import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  scaleLinear,
  scaleTime,
  select,
  line,
  curveMonotoneX
} from 'd3';
import { indexOf, get, each, size } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';

import { colors, newModuleScale } from '../../../utils/chart.util';
import { dayParseTime } from 'src/app/progdash/utils/mappers';

enum CellChartEncoding {
  STRING = 'STRING',
  BAR = 'BAR',
  STACK = 'STACK',
  DOT = 'DOT',
  CAT = 'CAT',
  MCAT = 'MCAT',
  LINE = 'LINE',
}

/* tslint:disable component-selector  */
@Component({
  selector: 'CellChart',
  template: `
    <div class="container">
      <div
        *ngIf="options.encoding !== 'LINE' "
        [ngStyle]="visuelStyle">
        <div
          *ngIf="options.encoding === 'STACK'"
          class="multi-parent">
          <div
            class="multi"
            [ngStyle]="visuelStyle[item]"
            *ngFor="let item of options.keys">
          </div>
        </div>
        <div
          *ngIf="options.encoding === 'MCAT' "
          class="multi-parent">
          <div
            class="multi"
            [ngStyle]="visuelStyle[item]"
            *ngFor="let item of data[key]">
          </div>
        </div>
      </div>
      <span
        class="span-text" [ngStyle]="dataStyle"
        *ngIf="options.encoding !== 'LINE'">
          {{ dataHint }}
          <span class="sub-hint" *ngIf="dataSubHint">{{ dataSubHint }}</span>
      </span>
      <svg
        #svgRef
        *ngIf="options.encoding === 'LINE' ">
      </svg>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: baseline;
      }
      .span-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
      }
      .multi-parent {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .multi {
        display: flex;
        // opacity: 0.4;
      }
      .sub-hint {
        height: 14px;
        border: 1px solid #ccc;
        border-radius: 10px;
        display: inline-block;
        padding: 0 3px;
      }
    `,
  ],
})
export class CellChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild( 'svgRef' ) svgRefEl: ElementRef;

  @Input() data;
  // @Input() styles;
  @Input() options?;
  @Input() key?;
  @Input() keys?;
  @Input() hint?;
  @Input() formatter?;
  @Input() compositeHint?;
  @Input() subHint?;
  @Input() isCompact ? = true;
  @Input() extent = [];
  @Input() color?;
  @Input() format;
  @Input() scale?;
  @Input() height?;
  @Input() encoding?: CellChartEncoding = CellChartEncoding.BAR;
  @Input() cScale?;

  yScale = scaleLinear();
  line = line()
    .curve( curveMonotoneX )
    .x(( d: any ) => this.xScale( d.x ))
    .y(( d: any ) => this.yScale( d.y ));

  updateSub: Subscription;
  mode$ = new BehaviorSubject<string>( '' );
  styles$ = new BehaviorSubject<{}>({});
  private visuelStyle: {} = {
    transform: `translateY(50%)`,
    ['height.%']: 50,
    opacity: 0.5,
    ...this.styles,
  };
  private dataStyle: {} = { transform: `translateY(-50%)` };
  private xScale = scaleLinear();

  constructor () {}

  ngOnInit (): void {}

  ngAfterViewInit () {
    this.updateSub = this.styles$.subscribe( _ => {
      this.render();
    });
  }

  ngOnDestroy (): void {
    this.updateSub.unsubscribe();
  }

  render () {
    this.setState();
  }

  setState () {
    const data = get( this.data, this.key );
    const width = get( this.options, 'width' );

    this.updateScale();

    this.visuelStyle = {
      ...this.visuelStyle,
      ...get( this.styles, 'CELL', {}),
    };

    this.dataStyle = {
      ...this.dataStyle,
      ...get( this.styles, 'DETAIL', {}),
    };

    switch ( get( this.options, 'encoding' )) {
      case CellChartEncoding.STRING: {
        this.visuelStyle = {
          ...this.visuelStyle,
          background: 'none',
        };
        this.dataStyle = {
          ...this.dataStyle,
          ['width.px']: width,
        };
        return;
      }
      case CellChartEncoding.BAR: {
        this.visuelStyle = {
          ...this.visuelStyle,
          background: '#7775',
          ['width.px']: this.xScale( data ),
        };
        return;
      }
      case CellChartEncoding.STACK: {
        this.visuelStyle = {
          ...this.visuelStyle,
          background: 'transparent',
          ['width.px']: this.xScale( data ),
        };
        each( this.options.keys, ( key, index ) => {
          this.visuelStyle[key] = {
            background: this.cScale( index ),
            ['width.px']: this.xScale( get( this.data, key )),
          };
        });
        this.dataStyle = {
          ...this.dataStyle,
          ['width.px']: width,
        };
        return;
      }
      case CellChartEncoding.DOT: {
        this.xScale.range([
          this.xScale.range()[0] + this.visuelStyle['height.px'],
          this.xScale.range()[1] - this.visuelStyle['height.px'],
        ]);
        this.visuelStyle = {
          ...this.visuelStyle,
          background: '#7775',
          ['width.px']: this.visuelStyle['height.px'],
          ['border-radius.%']: 50,
          transform: `translate(${this.xScale( data )}px, 0)`,
        };
        return;
      }
      case CellChartEncoding.CAT: {
        this.visuelStyle = {
          ...this.visuelStyle,
          background: get (
            this.options, `color.${ data }`,
            this.cScale( indexOf( this.keys, data ))
          ),
          ['width.px']: 18,
          'opacity': 1,
        };
        this.dataStyle = {
          ...this.dataStyle,
          ['width.px']: width - 20,
          ['margin-left.px']: 20,
        };
        return;
      }
      case CellChartEncoding.MCAT: {
        this.visuelStyle = {
          ...this.visuelStyle,
          background: 'transparent',
          ['width.px']: this.height,
        };
        each( data, key => {
          this.visuelStyle[key] = {
            background: this.cScale( indexOf( this.keys, key )),
            ['width.px']: width / size( data ),
            'border-right': '1px solid #eee',
          };
        });
        this.dataStyle = {
          ...this.dataStyle,
          ['left.px']: 20,
          ['width.px']: width,
        };
        return;
      }
      case CellChartEncoding.LINE: {
        this.renderLine( data, width );
        return;
      }
      default: {
        return;
      }
    }
  }

  updateScale () {
    const scaleType = get( this.options, 'scaleType', 'linear' );
    switch ( scaleType ) {
      case 'linear': {
        this.scale = scaleLinear();
        break;
      }
      case 'time': {
        this.scale = scaleTime();
        break;
      }
      default:
        break;
    }
    this.xScale
      .domain( get( this.options, 'extent' ))
      .range( get( this.options, 'range' ));

    switch ( this.encoding ) {
      case 'LINE': {
        this.yScale
          .domain( get( this.options, 'yextent' ))
          .range( get( this.options, 'yrange' ));

        this.line
          .x(( d: any ) => this.xScale( d[ this.options.xkey || 'x' ]))
          .y(( d: any ) => this.yScale( d[ this.options.ykey || 'y' ] +
            newModuleScale[get( d, 'moduleName' )]
          ));

        if ( scaleType === 'time' ) {
          this.line.x(( d: any ) => this.xScale( dayParseTime( d[ this.options.xkey || 'x' ])));
        } else {
          this.line.x(( d: any ) => this.xScale( d[ this.options.xkey || 'x' ]));
        }

        break;
      }
      default:
        break;
    }
  }

  renderLine ( data, width ) {
    const svg = select( this.svgRefEl.nativeElement )
      .attr( 'width', width )
      .attr( 'height', get( this.options, 'yrange' )[0]);

    const linesEl = svg.selectAll( '.lines' ).data([ data ]);
    const linesElEnter = linesEl
      .enter()
      .append( 'g' )
      .merge( linesEl )
      .classed( 'lines', true );

    linesElEnter.append( 'path' ).classed( 'line', true );
    // linesElEnter.append( 'circle' ).classed( 'dot', true );

    linesElEnter
      .select( 'path.line' )
      .style( 'stroke-width', 1 )
      .style( 'stroke', '#777' )
      .style( 'stroke-linecap', 'round' )
      .style( 'fill', 'none' )
      .attr( 'd', this.line );

    // linesElEnter
    //   .select( 'path.dot' )
    //   .style( 'fill', '#777' )
    //   .attr( 'r', 3 )
    //   .attr( 'cx', 3 )
    //   .attr( 'cy', 3 )

    linesEl.exit().remove();
  }

  get dataHint () {
    let info;
    if ( this.compositeHint ) {
      info = '' + get( this.data, this.compositeHint[0], '' ) +
       '/' + get( this.data, this.compositeHint[1], '' );
    } else {
      info = get( this.data, this.hint || this.key );
    }

    if ( this.formatter ) {
      info = this.formatter( info );
    }

    return info;
  }

  get dataSubHint () {
    return this.subHint ? this.subHint( this.data ) : null;
  }

  get styles () {
    return this.styles$.getValue();
  }

  @Input()
  set styles ( value ) {
    this.styles$.next( value );
  }

  get mode () {
    return this.mode$.getValue();
  }

  @Input()
  set mode ( value ) {
    this.mode$.next( value );
  }
}

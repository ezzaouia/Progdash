import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  ElementRef,
  QueryList,
} from '@angular/core';
import { MatSortable, MatTableDataSource, MatSort } from '@angular/material';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  keys,
  mapValues,
  get,
  set,
  sortBy,
  take,
  takeRight,
  each,
  concat,
  filter,
  size,
  pull,
  findIndex,
  snakeCase,
 } from 'lodash';
 import { scaleOrdinal } from 'd3';

 import { RowTableMode } from '../tableViewManager';
import { colors } from '../../../utils/chart.util';
import { InteractionsService, Highlight } from '../../../shared/services';

/* tslint:disable component-selector  */
@Component({
  selector: 'CdkMColTableView',
  template: `
    <div #elRef class="container">
      <div
        class="table-container"
        *ngFor="let _col of displayedColumns; let index = index; let last = last">
        <cdk-table
          matSort
          #cdktableSort="matSort"
          [dataSource]="_mColDataSources[_col]">
          <ng-container *ngFor="let col of [ _col ]" cdkColumnDef="{{col}}">
            <cdk-header-cell
              [ngStyle]="{ 'width.px': columns[col].width }"
              *cdkHeaderCellDef>
              <div class="header-title">
                {{columns[col].name}}
                <button mat-icon-button>
                  <mat-icon
                    aria-label="sort"
                    (click)="onSortByColumn(col)">
                    sort
                  </mat-icon>
                </button>
                <button
                  *ngIf="columns[col].topBottom"
                  mat-icon-button>
                  <mat-icon
                    aria-label="horizontal_split"
                    (click)="onChangeTopBottom(col)">
                    horizontal_split
                  </mat-icon>
                </button>
              </div>
              <div
                class="header-filter"
                *ngIf="options.filter">
                  <HistogramChart
                    [data]="data"
                    [ykey]="col"
                    [options]="columns[col]"
                    [width]="columns[col].width"
                    (updateRangeFilter)="onChangeRangeFilterValues($event)"
                    [type]="columns[col].histo">
                  </HistogramChart>
              </div>
            </cdk-header-cell>
            <cdk-cell
              [ngStyle]="{'width.px': columns[col].width, 'height.px': colDefaultHeight}"
              *cdkCellDef="let element;">
              <mat-divider></mat-divider>
              <CellChart
                [data]="element"
                [extent]="columns[col].extent"
                [encoding]="columns[col].encoding"
                [key]="col"
                [keys]="columns[col].keys"
                [hint]="columns[col].hint|| col"
                [options]="columns[col]"
                [mode]="innerRowMode[element.id] || mode"
                [cScale]="cScale"
                [styles]="rowHoverStyles[element.id] ||
                          _rowModeStyles[element.id] ||
                          _rowModeStyles['mode']">
              </CellChart>
            </cdk-cell>
          </ng-container>
          <cdk-header-row *cdkHeaderRowDef="[ _col ]"></cdk-header-row>
          <cdk-row
            [ngStyle]="(
                        rowHoverStyles[row.id] ||
                        _rowModeStyles[row.id] ||
                        _rowModeStyles['mode']
                      ).ROW"
            [ngClass]="{
              'highlight': ( highlight.id === row.id ) ||
                              ( row.focusUserIds && row.focusUserIds.includes(highlight.id) )
            }"
            (mouseenter)="onMouseenter(row.id)"
            (mouseleave)="onMouseleave(row.id)"
            *cdkRowDef="let row; columns: [ _col ];">
          </cdk-row>
        </cdk-table>

        <SlopLink
          *ngIf="height && !last"
          [ngStyle]="{'margin-top.px':  (options.filter ? (30 + 63): 30 ) }"
          [width]="width"
          [height]="height"
          [data]="_mColSlopLinksData[index]">
        </SlopLink>

      </div>

    </div>
    `,
  styles: [ `
  :host {
    width: fit-content;
    height: 100%;
    display: block;
  }
  .container {
    display: flex;
    // justify-content: space-around;
    justify-content: space-around;
  }
  .table-container {
    display: flex;
  }
  .cdk-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 12.5px;
    font-weight: 400;
  }
  .cdk-header-row {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    font-weight: 600 !important;
    padding: 0 12px;
  }
  .cdk-row {
    display: flex;
    border: 1px solid transparent;
    margin: -1px;
    padding: 0 6px;
  }
  .cdk-cell {
    // width: 100px;
    padding: 0 1px;
  }
  .cdk-header-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    min-height: 30px;
  }
  .header-title {
    display: flex;
    align-items: center;
  }
  .mat-icon-button {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
  .icon-activate {
    color: lightblue !important;
  }
  .mat-icon {
   color: #7775;
  }
  .sort-asc {
    transform: rotate(180deg);
  }
  .sort-desc {
    transform: rotate(0deg);
  }
  .overview {
    position: absolute;
    top: -12px;
    left: -12px;
  }
  .highlight {
    border: 1px solid #7e3ff2;
    box-shadow: 2px 0px 5px #7e3ff2;
  }
  .header-filter {
    height: 63px;
  }
  ` ],
  animations: [
    // animation triggers go here
  ],
})
export class CdkMColTableViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild( 'elRef' ) elRef: ElementRef;
  @ViewChildren( 'cdktableSort' ) cdktableSortListElRef: QueryList<MatSort>;

  // @Input() dataStream;
  @Input() columns;
  @Input() options;
  @Input() colDefaultHeight;

  cScale: any = scaleOrdinal().range( colors );

  width = 18;
  widthControl = 2;
  height;
  _mColSlopLinksData = [];
  _mColDataSources = {};
  _mColDataSorts = {};
  _mColDataConnects = [];
  _mColRenderedColsData = [];
  _mColDataConnects$;
  _mColDataConnectsSup: Subscription;

  byCols = [];
  rowsTopBottomMode = {};
  rowsTopBottomStyles = {};

  _rowIdsMode = {};
  _rowsStyles = {};
  _rowModeStyles = { mode: {} };
  _topBottomBy = {};

  rowHoverMode = {};
  rowHoverStyles = {};
  rowStyles = {};
  rowsStyles = {};

  heightOffset = 1;
  overviewHeight = 5;
  topBottomN = 5;
  headerOffset = 130;
  isOverview = false;
  isTopBottom = false;

  highlight: Highlight = { id: '' };

  dataSub: Subscription;
  modeSub: Subscription;
  filterSub: Subscription;
  highlightSub: Subscription;
  dataSource: MatTableDataSource<any>;

  data$: BehaviorSubject<any[]>  = new BehaviorSubject([]);
  mode$: BehaviorSubject<string>  = new BehaviorSubject( '' );
  rangeFilterValues$: BehaviorSubject<any> = new BehaviorSubject( this.rangeFilter );
  highlight$ = this.interactionsService.highlight$;
  tableViewRenderedData$ = this.interactionsService.tableViewRenderedData$;

  constructor (
    private elementRef: ElementRef,
    private interactionsService: InteractionsService
  ) {}

  ngAfterViewInit () {
    // get the height of the Table
    this.height = this.elRef.nativeElement.offsetHeight;
    // init sorts for each dataSource from mColDataSource
    // and mColDataSorts
    this.dataSub = this.data$
      .subscribe( __ => {
        let ds, colName;
        this.cdktableSortListElRef.forEach(( matSortEl, index ) => {
          colName = this.displayedColumns[ index ];
          ds = this._mColDataSources[ colName ];
          this._mColDataSorts[ colName ] = matSortEl;
          ds.sort = matSortEl;
          ds.sortingDataAccessor = ( row, col ) => {
            switch ( col ) {
              default: {
                return get( row, col );
              }
            }
          };
        });
      });

    // this.dataSource.sortData = ...;

    if ( size( this.data ) * this.overviewHeight >= window.innerHeight ) {
      this.overviewHeight = this.viewportHeight / size( this.data );
    }

  }

  ngOnInit (): void {
    this.dataSub = this.data$
      .subscribe( __ => {
        this._mColDataConnects = [];
        this._mColDataSources = {};

        // init mColDataSources
        each( this.displayedColumns, col => {
          this._mColDataSources[col] = new MatTableDataSource( this.data );
        });

        // init filters for each dataSource from mColDataSource
        each( this._mColDataSources, ( ds: MatTableDataSource<any>, _ ) => {
          ds.filterPredicate = this.filterPredicate.bind( this );
        });

        this.filterSub = this.rangeFilterValues$
          .pipe( debounceTime( 150 ))
          .subscribe( ___ => {
            each( this._mColDataSources, ( ds: MatTableDataSource<any>, _ ) => {
              ds.filter = JSON.stringify( this.rangeFilterValues );
            });
          });

        // init connects to build slop link data
        // datasource . connect
        each( this.displayedColumns, col => {
          this._mColDataConnects.push( this._mColDataSources[col].connect());
        });

        combineLatest( ...this._mColDataConnects )
          .pipe( debounceTime( 200 ))
          .subscribe(( renderedColsData: any ) => {
            this._mColRenderedColsData = renderedColsData;
            this.buildSlopLinksData( renderedColsData );
          });

      });

    // // init mColDataSources
    // each( this.displayedColumns, col => {
    //   this._mColDataSources[col] = new MatTableDataSource( this.data );
    // });

    // // init filters for each dataSource from mColDataSource
    // each( this._mColDataSources, ( ds: MatTableDataSource<any>, _ ) => {
    //   ds.filterPredicate = this.filterPredicate.bind( this );
    // });

    // this.filterSub = this.rangeFilterValues$
    //   .pipe( debounceTime( 150 ))
    //   .subscribe( _ => {
    //     each( this._mColDataSources, ( ds: MatTableDataSource<any>, _ ) => {
    //       ds.filter = JSON.stringify( this.rangeFilterValues );
    //     });
    //   });

    // // init connects to build slop link data
    // // datasource . connect
    // each( this.displayedColumns, col => {
    //   this._mColDataConnects.push( this._mColDataSources[col].connect());
    // });

    // combineLatest( ...this._mColDataConnects )
    //   .pipe( debounceTime( 200 ))
    //   .subscribe(( renderedColsData: any ) => {
    //     this._mColRenderedColsData = renderedColsData;
    //     this.buildSlopLinksData( renderedColsData );
    //   });


    this.modeSub = this.mode$.subscribe( _ => {
      this.handleTableMode();
    });

    this.highlightSub = this.highlight$.subscribe( h => {
      this.handleHighlight( h );
    });
  }

  //  slop link data will be [ [slop b/ 1st two cols], [slop b/ 2nd two cols], etc... ]
  buildSlopLinksData ( renderedColsData: any[]) {
    this._mColSlopLinksData = [];

    let slopData, d, findex, target, sh, th;
    each( renderedColsData, ( renderedColData, i ) => {
      if ( i === size( renderedColsData ) - 1 ) {
        return false;
      }

      slopData = [];
      each ( renderedColData, ( o, j ) => {
        findex = findIndex( renderedColsData[i + 1], { id: o.id });
        target = renderedColsData[i + 1][ findex ];
        if ( !o || !target ) {
          console.log( ' ===== ', target , o, renderedColsData, i + 1, findex );
        }

        sh = this.rowHeightStyle( o.id );
        th = this.rowHeightStyle( target.id );
        d = [
          [ 0, j,  sh ],
          [ this.widthControl, j, sh ],
          [ this.width - this.widthControl,  findex, th ],
          [ this.width,  findex, th ],
        ];
        d['id'] = snakeCase( o.id );
        slopData.push( d );
      });

      this._mColSlopLinksData.push( slopData );

      // Added here to build a slop b/ line chart and table view
      if ( i === 0 ) {
        this.tableViewRenderedData$.next( slopData );
      }

    });
  }

  rowHeightStyle ( id ) {
    const h = (
      this.rowHoverStyles[ id ] ||
      this._rowModeStyles[ id ] ||
      this._rowModeStyles[ 'mode' ]
    ).ROW;
    if ( h && h['height.px']) {
      return h['height.px'];
    } else {
      return this.colDefaultHeight;
    }
  }

  ngOnDestroy (): void {
    this.dataSub.unsubscribe();
    this.filterSub.unsubscribe();
    this.modeSub.unsubscribe();
    this.highlightSub.unsubscribe();
  }

  filterPredicate ( row: any, filterStr: string ) {
    let ordOp = true, catOp = true, histo = '', encoding, d;
    const fjson = JSON.parse( filterStr );

    each( keys( fjson ), (  col ) => {
      d = get( fjson, col );
      histo = get ( get( this.columns , `${col}` ), `histo` );
      encoding = get ( get( this.columns , `${col}` ), `encoding` );

      if ( histo === 'ordinal' )  {
        ordOp = ordOp && ( get( row, col ) >= d[0] && get( row, col ) <= d[1]);
      } else if ( histo === 'categorical' && encoding === 'CAT' ) {
        catOp = catOp && ( d ? get( row, col ) === d : true );
      } else if ( histo === 'categorical' && encoding === 'MCAT' ) {
        catOp = catOp && ( d ? get( row, col ).includes( d ) : true );
      }
    });
    return ordOp && catOp;
  }

  onChangeRangeFilterValues ( $event ) {
    this.rangeFilterValues$.next({ ...this.rangeFilterValues$.getValue(), ...$event });
  }

  onMouseenter ( rowId ) {
    this.highlight$.next({ id: rowId });
    // if ( this.mode === RowTableMode.NORMAL ) {
    //   return;
    // }
    // this.rowHoverStyles[rowId] =  get ( this.styles, `${RowTableMode.NORMAL}` );
  }

  onMouseleave ( rowId ) {
    this.highlight$.next({ id: '' });
    // if ( this.mode === RowTableMode.NORMAL ) {
    //   return;
    // }
    // this.rowHoverStyles[rowId] = '';
  }

  onSortByColumn ( columnName ) {
    this._mColDataSorts[columnName].sort( <MatSortable>({ id: columnName, start: 'desc' }));
  }

  onChangeTopBottom ( columnName ) {
    this._handleTableMode({ mode: RowTableMode.TOPBOTTOM, columnName });
  }

  onChangeMode () {
    this.isOverview = !this.isOverview;
    const mode = this.isOverview ?
          RowTableMode.OVERVIEW : RowTableMode.NORMAL;

    this._handleTableMode({ mode });
  }

  handleTableMode () {
    this.rowStyles = get ( this.styles, `${this.mode}.ROW` );

    if ( this.mode === RowTableMode.TOPBOTTOM ) {
      const sortedData = sortBy( this.dataSource.filteredData, this.byCols );
      const top = take( sortedData, 5 );
      const bottom = takeRight( sortedData, 5 );
      // const between = slice( sortedData, 5, size( sortedData ) - 5 );
      each( concat( top, bottom ), o => {
        this.rowsTopBottomMode[o.id] = RowTableMode.NORMAL;
        this.rowsTopBottomStyles[o.id] = get ( this.styles, `${RowTableMode.NORMAL}.ROW` );
      });
    } else {
      this.rowsTopBottomMode = {};
      this.rowsTopBottomStyles = {};
    }
  }

  handleHighlight ( h ) {
    this.highlight = h;
  }

  _handleTableMode ( options ) {
    const { mode, columnName } = options;

    switch ( mode ) {
      case RowTableMode.NORMAL : {
        this._rowModeStyles['mode'] = get ( this.styles, `${mode}` );
        this.byCols = [ ];
        break;
      }
      case RowTableMode.OVERVIEW : {
        this._rowModeStyles['mode'] = get ( this.styles, `${mode}` );
        this.byCols = [ ];
        break;
      }
      case RowTableMode.TOPBOTTOM: {
        let sortedData, top, bottom;
        if ( this._topBottomBy[columnName]) {
          this._topBottomBy[columnName] = false;
        } else {
          this._topBottomBy[columnName] = true;
        }

        // TODO better loop
        this._rowModeStyles['mode'] = get ( this.styles, `${RowTableMode.NORMAL}` );

        each( this._topBottomBy, ( value, key ) => {
          sortedData = sortBy( this._mColDataSources[columnName].filteredData, [ key ]);
          top = take( sortedData, 5 );
          bottom = takeRight( sortedData, 5 );
          if ( !value ) {
            each( concat( top, bottom ), o => {
              set( this._rowModeStyles, o.id, '' );
            });
          }
        });

        each( this._topBottomBy, ( value, key ) => {
          sortedData = sortBy( this._mColDataSources[columnName].filteredData, [ key ]);
          top = take( sortedData, 5 );
          bottom = takeRight( sortedData, 5 );
          if ( value ) {
            this._rowModeStyles['mode'] = get ( this.styles, `${mode}` );
            each( concat( top, bottom ), o => {
              set( this._rowModeStyles, o.id,  get ( this.styles, `${RowTableMode.NORMAL}` ));
            });
          }
        });
        break;
      }
      default:
        break;
    }

    // this.buildSlopLinksData ( this._mColRenderedColsData );

  }

  handleCatFocusMode ( colName: string, category: string ) {
    this.rowStyles = get ( this.styles, `${this.mode}.ROW` );

    const catData = filter( this.dataSource.filteredData, o => {
      return o[colName] === category;
    });

    const norCatData = filter( this.dataSource.filteredData, o => {
      return o[colName] !== category;
    });

    // this.dataSource.data = concat( norCatData, catData );

    each( norCatData, o => {
      // this.rowsCatFocusMode[o.id] = TableMode.OVERVIEW;
      // this.rowsCatFocusStyles[o.id] = get ( this.styles, `${TableMode.OVERVIEW}.ROW` );
    });
  }

  // get data () {
  //   return this.dataStream.getValue();
  // }

  get displayedColumns () {
    const cls = keys( this.columns );
    return pull( cls, 'id' );
  }

  get rangeFilter () {
    let histo;
    return mapValues( this.columns, ( d, _ ) => {
      histo = get ( d, 'histo' );
      if ( histo === 'ordinal' ) {
        return [ 0, 9999 ];
      } else if ( !histo || histo === 'categorical' ) {
        return '';
      }
    });
  }

  get rangeFilterValues () {
    return this.rangeFilterValues$.getValue();
  }

  get mode () {
    return this.mode$.getValue();
  }

  @Input()
  set mode ( value ) {
    this.mode$.next( value );
  }

  get innerRowMode () {
    return { ...this.rowHoverMode, ...this.rowsTopBottomMode };
  }

  get innerRowStyles () {
    return { ...this.rowHoverStyles, ...this.rowsTopBottomStyles };
  }


  get styles () {
    return {
      [RowTableMode.NORMAL]: {
        ROW: {
          ['height.px']: this.colDefaultHeight,
        },
        CELL: {
          ['height.px']: this.colDefaultHeight - this.heightOffset,
        },
        DETAIL: {
          opacity: 1,
        },
      },
      [RowTableMode.OVERVIEW]: {
        ROW: {
          ['height.px']: this.overviewHeight,
        },
        CELL: {
          ['height.px']: this.overviewHeight - this.heightOffset,
        },
        DETAIL: {
          opacity: 0,
        },
      },
      [RowTableMode.TOPBOTTOM]: {
        ROW: {
          ['height.px']: this.overviewHeight * 0.9,
        },
        CELL: {
          ['height.px']: this.overviewHeight * 0.9 - this.heightOffset,
        },
        DETAIL: {
          opacity: 0,
        },
      },
    };
  }

  get viewportHeight () {
    return ( window.innerHeight -
              this.elementRef.nativeElement.getBoundingClientRect().top -
                this.headerOffset );
  }

  get slopLinksHeight () {
    return this.elRef.nativeElement.offsetHeight;
  }

  @Input()
  get data () {
    return this.data$.getValue();
  }

  set data ( value ) {
    this.data$.next( value );
  }

}

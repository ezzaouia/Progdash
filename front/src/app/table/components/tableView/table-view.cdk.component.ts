import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatSort, MatSortable, MatTableDataSource, MatPaginator } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
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
  slice,
  split,
  join
 } from 'lodash';
import { RowTableMode } from '../tableViewManager';
import { scaleOrdinal } from 'd3';
import { colors } from '../../../utils/chart.util';
import { InteractionsService, Highlight } from '../../../shared/services';
import { debounceTime } from 'rxjs/operators';
import { omit } from '@ngrx/store/src/utils';


/* tslint:disable component-selector  */
@Component({
  selector: 'CdkTableView',
  template: `
    <cdk-table matSort [dataSource]="dataSource" id="cdk-table">
      <ng-container *ngFor="let col of displayedColumns" cdkColumnDef="{{col}}">
        <cdk-header-cell
          [ngStyle]="{
              'width.px': columns[col].width,
              display: (columns[col].header ?
                  (((col === 'print') && !isStartPrintReport) ? 'none' : 'initial' ): 'none')
            }"
          *cdkHeaderCellDef>
          <div class="header-title">
            {{columns[col].name}}
            <button
              *ngIf="col !== 'print' && col !== 'moremenu'"
              class="mat-icon-button mat-24">
              <mat-icon
                matTooltip="Cliquer pour trier"
                class="sort-mat-icon"
                [ngClass]="{
                  'sort-asc' : (sort.active === col) && (sort.direction === 'asc'),
                  'sort-desc' : (sort.active === col) && (sort.direction === 'desc')
                }"
                aria-label="sort"
                (click)="onSortByColumn(col)">
                sort
              </mat-icon>
            </button>
            <button
              *ngIf="columns[col].topBottom"
              class="mat-icon-button mat-24">
              <mat-icon
                aria-label="horizontal_split"
                (click)="onChangeTopBottom(col)">
                horizontal_split
              </mat-icon>
            </button>
          </div>
          <div
            class="header-filter"
            matTooltip="Cliquer sur une barre pour activer/désactiver un filtre"
            *ngIf="columns[col].histo">
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
          [ngClass]="{'skip-print': ( col === 'print' ) ? true : false }"
          [ngStyle]="{
            'width.px': ((col === 'print') && !isStartPrintReport) ? 0 : columns[col].width,
            'height.px': colDefaultHeight,
            'display': ((col === 'print') && !isStartPrintReport) ? 'none' : 'initial'
          }"
          *cdkCellDef="let element;">

          <button
            *ngIf="(col === 'moremenu')"
            class="mat-icon-button mat-24 btn-learner-more"
            matTooltip="Voir Détail Apprenant"
            (click)="userMoreMenuHandler.emit({ user: element, action: 'detail' })">
              <mat-icon class="mat-24" aria-label="menu">open_in_browser</mat-icon>
          </button>

          <PrintWidget
            *ngIf="( (col === 'print') && isStartPrintReport )"
            [widgetId]="'table-row-' + element.id"
            [disabled]="(selectedWidgets.includes( 'table-view' ) ? true : false)"
            [checked]="(selectedWidgets.includes( 'table-view' ) ?
               true : selectedWidgets.includes( 'table-row-' + element.id ))"
            (checkWidgetHandler)="checkWidgetHandler.emit($event)">
          </PrintWidget>

          <CellChart
            *ngIf=" col !== 'print' && col !== 'moremenu' "
            [data]="element"
            [extent]="columns[col].extent"
            [encoding]="columns[col].encoding"
            [key]="col"
            [keys]="columns[col].keys"
            [hint]="columns[col].hint|| col"
            [compositeHint]="columns[col].compositeHint || null"
            [subHint]="columns[col].subHint || null"
            [formatter]="columns[col].formatter || null"
            [options]="columns[col]"
            [mode]="innerRowMode[element.id] || mode"
            [cScale]="cScale"
            [height]="(colDefaultHeight - 1)"
            [styles]="rowHoverStyles[element.id]">
          </CellChart>
        </cdk-cell>
      </ng-container>
      <cdk-header-row id="cdk-header-row" *cdkHeaderRowDef="displayedColumns"></cdk-header-row>
      <cdk-row
        id="table-row-{{ row.id }}"
        [ngStyle]="rowHoverStyles[row.id]"
        [ngClass]="{
          'highlight': ( highlight.id === row.id ) ||
                          ( row.focusUserIds && row.focusUserIds.includes(highlight.id) )
        }"
        (mouseenter)="onMouseenter(row.id)"
        (mouseleave)="onMouseleave(row.id)"
        *cdkRowDef="let row; columns: displayedColumns;">
      </cdk-row>
    </cdk-table>

    <mat-paginator
      [pageSize]="40"
      [pageSizeOptions]="[10, 20, 30, 40]"
      showFirstLastButtons>
    </mat-paginator>

    `,
  styles: [ `
  :host {
    width: fit-content;
    height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .cdk-table {
    disable: block;
    width: 100%;
    height: 100%;
    font-size: 12.5px;
    font-weight: 400;
  }
  .cdk-header-row {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    font-weight: 600 !important;
  }
  .header-filter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .cdk-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    // border: 1px solid transparent;
    // box-sizing: border-box;
  }
  .cdk-cell {
    // width: 100px;
    padding: 0 1px;
    border-bottom: 1px solid #ccc;
  }
  .cdk-header-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 3px;
  }
  .header-title {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    height: 45px;
  }
  .table-icon-button {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
  .icon-activate {
    color: lightblue !important;
  }
  .sort-mat-icon {
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
  ` ],
  animations: [
    // animation triggers go here
  ],
})
export class CdkTableViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  // @Input() dataStream;
  @Input() columns;
  @Input() options;
  @Input() colDefaultHeight;

  @Input() isStartPrintReport;
  @Input() selectedWidgets: string[];
  @Output() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();
  @Output() sortColumnTraceHandler = new EventEmitter();
  @Output() filterColumnTraceHandler = new EventEmitter();
  @Output() userMoreMenuHandler = new EventEmitter();

  cScale: any = scaleOrdinal().range( colors );

  byCols = [];
  rowsTopBottomMode = {};
  rowsTopBottomStyles = {};

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

  startSort = 'desc';
  dataSub: Subscription;
  modeSub: Subscription;
  filterSub: Subscription;
  highlightSub: Subscription;
  dataSource: MatTableDataSource<any>;

  data$: BehaviorSubject<any[]>  = new BehaviorSubject([]);
  mode$: BehaviorSubject<string>  = new BehaviorSubject( '' );
  rangeFilterValues$: BehaviorSubject<any> = new BehaviorSubject( this.rangeFilter );
  highlight$ = this.interactionsService.highlight$;

  constructor (
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private interactionsService: InteractionsService
  ) {}

  ngAfterViewInit () {
    this.dataSource.sortingDataAccessor = ( row, col ) => {
      switch ( col ) {
        case 'fullName': {
          return join( slice( split( get( row, col ), ' ' ), -1 ), ' ' );
        }
        default: {
          return get( row, col );
        }
      }
    };

    this.dataSource.sort = this.sort;
    // this.dataSource.sortData = ...;
    // if ( size( this.data ) * this.overviewHeight >= window.innerHeight ) {
    //   this.overviewHeight = this.viewportHeight / size( this.data );
    // }

  }

  ngOnInit (): void {
    this.dataSub = this.data$
      .subscribe( _ => {
        this.dataSource = new MatTableDataSource( this.data );
        this.dataSource.sortingDataAccessor = ( row, col ) => {
          switch ( col ) {
            case 'fullName': {
              return join( slice( split( get( row, col ), ' ' ), -1 ), ' ' );
            }
            default: {
              return get( row, col );
            }
          }
        };

        this.dataSource.sort = this.sort;

        this.dataSource.paginator = this.paginator;
        /* translate to french.*/
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Nombre d\'élements par page :';
        this.dataSource.paginator._intl.getRangeLabel = this.getRangeLabel.bind( this ) ;
        this.dataSource.paginator._intl.firstPageLabel = 'Première page' ;
        this.dataSource.paginator._intl.lastPageLabel = 'Dernière page';
        this.dataSource.paginator._intl.nextPageLabel = 'Page suivante';
        this.dataSource.paginator._intl.previousPageLabel = 'Page précédente';

        this.dataSource.filterPredicate = this.filterPredicate.bind( this );

        this.rangeFilterValues$.next( this.rangeFilter );
      });


    this.filterSub = this.rangeFilterValues$
      .pipe( debounceTime( 150 ))
      .subscribe( _ => {
        this.dataSource.filter = JSON.stringify( this.rangeFilterValues );
      });

    this.modeSub = this.mode$
      .subscribe( _ => {
        this.handleTableMode();
      });

    this.highlightSub = this.highlight$
      .subscribe( h => {
        this.handleHighlight( h );
      });
  }

  ngOnDestroy (): void {
    this.dataSub.unsubscribe();
    this.modeSub.unsubscribe();
    this.filterSub.unsubscribe();
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
    this.filterColumnTraceHandler.emit( $event );
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
    this.sort.sort( <MatSortable>({ id: columnName, start: 'desc' }));
    this.sortColumnTraceHandler.emit({ columnName, sort: this.startSort  });
    this.startSort = this.startSort === 'desc' ? 'asc' : 'desc';
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
          sortedData = sortBy( this.dataSource.filteredData, [ key ]);
          top = take( sortedData, 5 );
          bottom = takeRight( sortedData, 5 );
          if ( !value ) {
            each( concat( top, bottom ), o => {
              set( this._rowModeStyles, o.id, '' );
            });
          }
        });

        each( this._topBottomBy, ( value, key ) => {
          sortedData = sortBy( this.dataSource.filteredData, [ key ]);
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
    return keys( this.columns );
  }

  get rangeFilter () {
    let histo;
    return mapValues( this.columns, ( d, _ ) => {
      histo = get ( d, 'histo' );
      if ( histo === 'ordinal' ) {
        return [ 0, 999999999999 ];
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

  private  getRangeLabel = ( page: number, pageSize: number, length: number ) => {
    return (( page * pageSize ) + 1 ) + ' - ' + (( page * pageSize ) + pageSize ) + ' sur ' + length;
  }

  get viewportHeight () {
    return ( window.innerHeight -
              this.elementRef.nativeElement.getBoundingClientRect().top -
                this.headerOffset );
  }

  @Input()
  get data () {
    return this.data$.getValue();
  }

  set data ( value ) {
    this.data$.next( value );
  }

}

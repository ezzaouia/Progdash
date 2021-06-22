import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { BehaviorSubject, Subscription, merge } from 'rxjs';
import {
  GridsterConfig,
  CompactType,
  GridType,
  DisplayGrid
} from 'angular-gridster2';
import { each, get, set, last, split, replace, startsWith } from 'lodash';

import {
  InfoWidgetComponent,
  TopNUsersWidgetComponent,
  TimelineWidgetComponent,
  TopNRulesWidgetComponent
} from '../../components';

enum Timescale {
  lastWeek = '7 derniers jours',
  lastMonth = '30 derniers jours',
}

/* tslint:disable component-selector  */
@Component({
  selector: 'ProgBoard',
  template: `
    <gridster
      #gridster
      [options]="boardOptions"
      data-simplebar
      data-simplebar-auto-hide="false">
        <gridster-item
          class="grid-item mat-elevation-z1"
          [item]="item.value.grid"
          *ngFor="let item of boardGrid | keyvalue"
          (mouseenter)="hoverWidgetTraceHandler.emit( { event: 'mouseenter', id: item.key } )"
          (mouseleave)="hoverWidgetTraceHandler.emit( { event: 'mouseleave', id: item.key } )">

            <ndc-dynamic
              [ndcDynamicComponent]="item.value.component"
              [ndcDynamicInputs]="item.value.data">
            </ndc-dynamic>

        </gridster-item>
    </gridster>

    <div
      class="pv-launcher mat-elevation-z3"
      *ngIf="selectedRules.length">
        <button
          class="raised-button"
          mat-raised-button
          matTooltipPosition="above"
          matTooltip="Lancer le mode présentiel avec les règles sélectionnées"
          (click)="onGeneratePVLiveLinkLive()">
            <mat-icon
              class="back-icon"
              aria-label="open_in_new">
                open_in_new
            </mat-icon>
            <span>
              Mode Présentiel | {{ selectedRules.length | formatAttr:'score' }}
            </span>
        </button>
        <button
          mat-mini-fab
          (click)="cancelPVLiveHandler.emit($event)">
          <mat-icon>cancel</mat-icon>
        </button>
    </div>

  `,
  styles: [ `
      :host {
        display: block;
        height: calc(100vh - 46px);
        width: 100%;
      }
      gridster {
        background: #eee;
        box-sizing: border-box;
        width: 100vw; /*calc(100vw - 300px);*/
        overflow-x: hidden !important;
      }
      .pv-launcher {
        position: fixed;
        bottom: 0px;
        left: 50%;
        z-index: 2000;
        transition: all 0.5 ease;
        border-radius: 4px;
        padding: 6px 6px;
        background: #fff;
      }
    `,
  ],
})
export class ProgBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild( 'gridster' ) gridElRef: ElementRef;

  @Input() boardWidth;
  @Input() selectedWidgets;

  @Output() checkRuleHandler = new EventEmitter();
  @Output() launchPVLiveHandler = new EventEmitter();
  @Output() generatePVLiveLinkHandler = new EventEmitter();
  @Output() cancelPVLiveHandler = new EventEmitter();
  @Output() checkWidgetHandler = new EventEmitter();
  @Output() hoverWidgetTraceHandler = new EventEmitter();
  @Output() moreRuleClickHandler = new EventEmitter();
  @Output() openProgTableHandler = new EventEmitter();

  boardOptions: GridsterConfig;
  boardGrid: any; // Array<GridsterItem>;

  updateSup: Subscription;
  classes$ = new BehaviorSubject<any>({ byId: null, allIds: null });
  selectedClass$ = new BehaviorSubject<{id: number; name: string}>( null );
  selectedTimescale$ = new BehaviorSubject<string>( '' );
  selectedRules$ = new BehaviorSubject<string[]>([]);
  isStartPrintReport$ = new BehaviorSubject<boolean>( false );
  update$ = merge(
    this.selectedClass$,
    this.selectedTimescale$,
    this.isStartPrintReport$,
    this.selectedRules$,
    this.classes$
  );

  colDefaultWidth = 100;
  colDefaultHeight = 30;

  constructor () {}

  static itemChange ( item, itemComponent ) {
    // console.log( 'itemChanged', item, itemComponent );
  }

  static itemResize ( item, itemComponent ) {
    // console.log( 'itemResized', item, itemComponent );
  }

  ngAfterViewInit (): void {}

  ngOnInit () {
    this.boardOptions = {
      itemChangeCallback: ProgBoardComponent.itemChange,
      itemResizeCallback: ProgBoardComponent.itemResize,
      compactType: CompactType.CompactLeft,
      swap: true,
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.OnDragAndResize,
      pushItems: true,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      fixedColWidth: Math.floor( this.boardWidth / 12 ),
      fixedRowHeight: 60,
      margin: 10,
    };

    this.boardGrid = {
      score: {
        grid: { cols: 3, rows: 3, y: 0, x: 0 },
        component: InfoWidgetComponent,
        data: {
          title: 'Règles acquises',
          infoLabel: 'en moyenne par apprenant',
        },
      },
      time: {
        grid: { cols: 3, rows: 3, y: 0, x: 3 },
        component: InfoWidgetComponent,
        data: {
          title: 'Temps d’entrainement',
          infoLabel: 'en moyenne par apprenant',
        },
      },
      activeUsers: {
        grid: { cols: 3, rows: 3, y: 0, x: 6 },
        component: InfoWidgetComponent,
        data: {
          title: 'Apprenants actifs',
          infoLabel: '',
        },
      },
      inactiveUsers: {
        grid: { cols: 3, rows: 3, y: 0, x: 9 },
        component: InfoWidgetComponent,
        data: {
          title: 'Apprenants inactifs',
          infoLabel: '',
        },
      },
      connections: {
        grid: { cols: 3 * 4, rows: 4, y: 3, x: 0 },
        component: TimelineWidgetComponent,
        data: {
          title: 'Nombre de connexions cumulées par jour',
        },
      },
      'topNUsers.score': {
        grid: { cols: 3, rows: 6, y: 7, x: 0 },
        component: TopNUsersWidgetComponent,
        data: {
          title: 'Meilleurs scores',
          openProgTableHandler: this.openProgTableHandler,
        },
      },
      'topNUsers.time': {
        grid: { cols: 3, rows: 6, y: 7, x: 3 },
        component: TopNUsersWidgetComponent,
        data: {
          title: 'Meilleurs engagements',
          openProgTableHandler: this.openProgTableHandler,
        },
      },
      'topNUsers.help': {
        grid: { cols: 3, rows: 6, y: 7, x: 6 },
        component: TopNUsersWidgetComponent,
        data: {
          title: 'Besoin d\'aide',
          openProgTableHandler: this.openProgTableHandler,
        },
      },
      'topNUsers.dropout': {
        grid: { cols: 3, rows: 6, y: 7, x: 9 },
        component: TopNUsersWidgetComponent,
        data: {
          title: 'Manque de pratique',
          openProgTableHandler: this.openProgTableHandler,
        },
      },
      'topNRules.focused': {
        grid: { cols: 4, rows: 6, y: 13, x: 0 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Les règles les plus difficiles en cours d’apprentissage',
          checkRuleHandler: this.checkRuleHandler,
        },
      },
      'topNRules.acquired': {
        grid: { cols: 4, rows: 6, y: 13, x: 4 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Les règles acquises les plus difficiles',
          checkRuleHandler: this.checkRuleHandler,
        },
      },
      'topNRules.known': {
        grid: { cols: 4, rows: 6, y: 13, x: 8 },
        component: TopNRulesWidgetComponent,
        data: {
          title: 'Exemples de règles sues initialement',
          checkRuleHandler: this.checkRuleHandler,
        },
      },
    };


    this.updateSup = this.update$.subscribe( _ => {
      let data, addedVal;
      if ( this.selectedTimescale ) {
        each( this.boardGrid, ( value, key ) => {
          data = get(
            this.classes,
            `byId.${this.selectedClass.id}.insights.${
              this.selectedTimescale
            }.${key}`
          );

          if (( key === 'connections' ) ||
               ( startsWith( key, 'topNRules' )) ||
                 ( startsWith( key, 'topNUsers' ))) {
            addedVal = { data };
          } else {
            addedVal = {
              ...data,
              sumd: Math.abs( get( data, 'sumd' )),
              sign: get( data, 'sumd' ) >= 0 ? 'plus' : 'minus',
            };
          }

          set( value, 'data', {
            ...value.data,
            ...addedVal,
            id: replace( key, '.', '-' ),
            key: last( split( key, '.' )),
            timescaleLabel: get( Timescale, this.selectedTimescale ),
            timescale: this.selectedTimescale,
            isStartPrintReport: this.isStartPrintReport,
            checkWidgetHandler: this.checkWidgetHandler,
            moreRuleClickHandler: this.moreRuleClickHandler,
            selectedWidgets: this.selectedWidgets,
            selectedRules: this.selectedRules,
            isPVLive: true,
            users: get( this.classes, `byId.${this.selectedClass.id}.users`, []),
          });
        });

        console.log( '=========== this.boardGrid', this.boardGrid );

      }
    });
  }

  ngOnDestroy (): void {
    this.updateSup.unsubscribe();
  }

  changedOptions () {
    this.boardOptions.api.optionsChanged();
  }

  removeItem ( item ) {
    this.boardGrid.splice( this.boardGrid.indexOf( item ), 1 );
  }

  addItem () {
    //  this.boardGrid.push({});
  }

  onGeneratePVLiveLinkLive () {
    this.generatePVLiveLinkHandler.emit( this.selectedRules$.getValue());
  }

  @Input()
  set classes ( value ) {
    this.classes$.next( value );
  }

  get classes () {
    return this.classes$.getValue();
  }

  @Input()
  set selectedTimescale ( value ) {
    this.selectedTimescale$.next( value );
  }

  get selectedTimescale () {
    return this.selectedTimescale$.getValue();
  }

  @Input()
  set selectedClass ( value ) {
    this.selectedClass$.next( value );
  }

  get selectedClass () {
    return this.selectedClass$.getValue();
  }

  @Input()
  set isStartPrintReport ( value ) {
    this.isStartPrintReport$.next( value );
  }

  get isStartPrintReport () {
    return this.isStartPrintReport$.getValue();
  }

  @Input()
  set selectedRules ( value ) {
    this.selectedRules$.next( value );
  }

  get selectedRules () {
    return this.selectedRules$.getValue();
  }
}

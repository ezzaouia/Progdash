import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterContentInit,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { get } from 'lodash';

import { UserDetailComponent } from '../../components';
import { Modal } from '../../../shared/components';
import { OpenPVLiveLinkComponent } from '../openPVLiveLink';

/* tslint:disable component-selector  */
@Component({
  selector: 'ProgdashManager',
  template: `
    <ProgdashView [isSidenavOpened]="!isProgTableOpened">
      <app-navbar class="toolbar mat-elevation-z3">
        <div class="logo">
          <!-- mat-icon aria-label="menu">graphic_eq</mat-icon -->
          <img src="assets/icon/voltaire-logo.jpg" alt="">
          <span>Suivi Voltaire</span>
        </div>


        <span class="fill"></span>

        <!-- from table -> back to dash -->
        <button
          *ngIf="isProgTableOpened || isProgEvaluationOpened"
          mat-stroked-button
          (click)="openProgBoardHandler.emit($event)">
            <mat-icon aria-label="menu">arrow_back</mat-icon>
            Tableau de bord
        </button>

        <TimescaleMenu
          *ngIf="!(isProgTableOpened || isProgEvaluationOpened) && selectedClass"
          [selectedTimescale]="selectedTimescale"
          (timescaleHandler)="timescaleHandler.emit($event)">
        </TimescaleMenu>

        <span class="fill"></span>

        <div class="class-picker">
          <button
            mat-button
            [matMenuTriggerFor]="className"
            yPosition="below">
            <span *ngIf="!selectedClass.name">
                Sélectionner une classe
            </span>
            <span class="class-name">{{ selectedClass ? selectedClass.name : '' }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
          </button>
        </div>

        <button
          mat-button
          [disabled]="!selectedClass.name"
          (click)="openProgTableHandler.emit({ id: 'call-to-action-btn' })">
          <mat-icon aria-label="menu">multiline_chart</mat-icon>
          Détails
        </button>

        <button
          mat-button
          [disabled]="!selectedClass.name"
          (click)="openProgEvaluationHandler.emit($event)">
          <mat-icon aria-label="menu">bubble_chart</mat-icon>
          Évaluations
        </button>

        <div class="print-container">
          <button
            class="raised-button"
            mat-raised-button
            *ngIf="isStartPrintReport"
            (click)="printReportHandler.emit( selectedWidgets )">
              Imprimer | {{ selectedWidgets.length | formatAttr:'widget' }}
          </button>
          <button
            class="fab-button mat-32"
            mat-button
            [disabled]="!selectedClass.name"
            *ngIf="!isStartPrintReport"
            (click)="startPrintReportHandler.emit($event)">
              <mat-icon *ngIf="!isStartPrintReport">print</mat-icon>
          </button>
          <button
            mat-mini-fab
            *ngIf="isStartPrintReport"
            (click)="closePrintReportHandler.emit($event)">
              <mat-icon>print_disabled</mat-icon>
          </button>
        </div>

        <button
          class="fab-button mat-32"
          mat-stroked-button
          [matMenuTriggerFor]="more"
          yPosition="below">
            <mat-icon aria-label="menu">more_vert</mat-icon>
        </button>

      </app-navbar>

      <mat-menu #className="matMenu">
        <ClassNameMenu
          [classListData]="(classes ? classes.allIds : [])"
          (selectClassHandler)="selectClassHandler.emit($event)">
        </ClassNameMenu>
      </mat-menu>

      <mat-menu #more="matMenu">
        <MoreMenu
          (navigateToSuiviStatsHandler)="navigateToSuiviStatsHandler.emit()"
          (signOutHandler)="signOutHandler.emit()">
        </MoreMenu>
      </mat-menu>

      <div #board class="board">

        <ProgBoard
          id="progboard"
          *ngIf="boardWidth && !(isProgTableOpened || isProgEvaluationOpened)"
          [boardWidth]="boardWidth"
          [classes]="classes"
          [isStartPrintReport]="isStartPrintReport"

          [selectedClass]="selectedClass"
          [selectedTimescale]="selectedTimescale"
          [selectedRules]="selectedRules"
          [selectedWidgets]="selectedWidgets"

          (checkRuleHandler)="checkRuleHandler.emit($event)"
          (launchPVLiveHandler)="launchPVLiveHandler.emit($event)"
          (generatePVLiveLinkHandler)="generatePVLiveLinkHandler.emit($event)"
          (cancelPVLiveHandler)="cancelPVLiveHandler.emit($event)"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)"
          (hoverWidgetTraceHandler)="hoverWidgetTraceHandler.emit($event)"
          (moreRuleClickHandler)="moreRuleClickHandler.emit($event)"
          (openProgTableHandler)="openProgTableHandler.emit($event)">
        </ProgBoard>

        <ProgTable
          *ngIf="isProgTableOpened"
          [isStartPrintReport]="isStartPrintReport"
          [selectedWidgets]="selectedWidgets"
          [modulesData]="(selectedClass ?
            (classes.byId[selectedClass.id] ?
              classes.byId[selectedClass.id].modules : []) : [])"
          [userListData]="(selectedClass ?
            (classes.byId[selectedClass.id] ?
              classes.byId[selectedClass.id].users : []) : [])"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)"
          (closeProgTableHandler)="closeProgTableHandler.emit($event)"

          (sortColumnTraceHandler)="sortColumnTraceHandler.emit($event)"
          (filterColumnTraceHandler)="filterColumnTraceHandler.emit($event)"
          (hoverWidgetTraceHandler)="hoverWidgetTraceHandler.emit($event)"
          (userMoreMenuHandler)="handleUserMoreMenuClick($event)"
          (exportTableToCsvHandler)="exportTableToCsvHandler.emit($event)">
        </ProgTable>

        <ProgEvaluation
          *ngIf="isProgEvaluationOpened"
          [isStartPrintReport]="isStartPrintReport"
          [selectedWidgets]="selectedWidgets"
          [evaluationsData]="(selectedClass ?
            (classes.byId[selectedClass.id] ?
              classes.byId[selectedClass.id].evaluations : []) : [])"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)"
          (closeProgTableHandler)="closeProgTableHandler.emit($event)"

          (sortColumnTraceHandler)="sortColumnTraceHandler.emit($event)"
          (filterColumnTraceHandler)="filterColumnTraceHandler.emit($event)"
          (hoverWidgetTraceHandler)="hoverWidgetTraceHandler.emit($event)"
          (exportTableToCsvHandler)="exportTableToCsvHandler.emit($event)">
        </ProgEvaluation>

      </div>

    </ProgdashView>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      app-navbar {
        width: calc(100vw);
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
      }
      .class-picker {
        display: flex;
        align-items: center;
        margin: 0 5px;
      }
      .class-picker span {
        color: #2196f3;
        font-family: "Roboto Mono", monospace;
        font-size: 19px;
        font-weight: 600;
        letter-spacing: 0px;
      }
      .sidenav {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 46px - 36px);
        overflow: hidden;
      }
      .logo {
        display: flex;
        height: 46px;
        align-items: center;
        justify-content: center;
        color: rgba(0, 0, 0, 0.87);
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        font-family: "Roboto Mono", monospace;
        background: rgba(255, 255, 255, 0.95);
      }
      .prog-table,
      .prog-table-btn {
        width: 98%;
        position: sticky;
        margin-left: auto;
      }
      .prog-table-btn {
        background: rgba(255, 215, 64, 0.95);
        color: rgba(0, 0, 0, 0.87);
      }
      .prog-table-menu-btn {
        border: 1px solid #ccc;
        border-radius: 2px;
        background: transparent;
        color: rgba(0,0,0,.87);
        margin-right: 6px;
        font-size: 13px;
      }
      .print-container {
        margin: 0 5px;
      }
      .logo img {
        width: 46px;
        height: 46px;
        margin-right: 12px;
      }
    `,
  ],
})
export class ProgdashManagerComponent implements AfterContentInit, OnInit, OnDestroy {
  @ViewChild( 'board' ) boardElRef: ElementRef;

  @Input() isDataLoaded;
  @Input() isProgTableOpened;
  @Input() isProgEvaluationOpened;
  @Input() isStartPrintReport;
  @Input() isGeneratingPVLiveLink$ = new BehaviorSubject<boolean>( false );
  @Input() isGeneratePVLiveLinkSuccess$ = new BehaviorSubject<boolean>( false );
  @Input() generatedLivePVLink$ = new BehaviorSubject<string>( '' );

  @Input() selectedClass;
  @Input() selectedTimescale;
  @Input() selectedRules;
  @Input() selectedWidgets;

  @Output() timescaleHandler = new EventEmitter();
  @Output() selectClassHandler = new EventEmitter();
  @Output() userMoreMenuHandler = new EventEmitter();
  @Output() openProgTableHandler = new EventEmitter();
  @Output() openProgEvaluationHandler = new EventEmitter();
  @Output() openProgBoardHandler = new EventEmitter();

  @Output() checkRuleHandler = new EventEmitter();
  @Output() launchPVLiveHandler = new EventEmitter();
  @Output() generatePVLiveLinkHandler = new EventEmitter();
  @Output() cancelPVLiveHandler = new EventEmitter();

  @Output() startPrintReportHandler = new EventEmitter();
  @Output() closePrintReportHandler = new EventEmitter();
  @Output() checkWidgetHandler = new EventEmitter();
  @Output() printReportHandler = new EventEmitter();
  @Output() hotPrintWidgetHandler = new EventEmitter();

  @Output() sortColumnTraceHandler = new EventEmitter();
  @Output() filterColumnTraceHandler = new EventEmitter();
  @Output() openUserDialogTraceHandler = new EventEmitter();
  @Output() hoverWidgetTraceHandler = new EventEmitter();
  @Output() moreRuleClickHandler = new EventEmitter();
  @Output() signOutHandler = new EventEmitter();
  @Output() navigateToSuiviStatsHandler = new EventEmitter();
  @Output() exportTableToCsvHandler = new EventEmitter();

  classes$ = new BehaviorSubject<any>({
    byId: {},
    allIds: [],
  });
  classDialogRef = null;
  marginOffset = 125;
  boardWidth;

  isProgTableRank = false;
  isProgTableCompare = true;
  isProgTableFilter = true;

  pvLiveModalData = {
      component: OpenPVLiveLinkComponent,
      link: '',
      isGenerateLinkSuccess: false,
      selectedRules: [],
      launchPVLiveHandler: this.launchPVLiveHandler,
      cancelPVLiveHandler: this.cancelPVLiveHandler,
  };
  lauchSupPV1: Subscription;
  lauchSupPV2: Subscription;

  constructor ( public dialog: MatDialog ) {}

  ngOnInit () {
    this.lauchSupPV1 = this.isGeneratingPVLiveLink$
      .subscribe( isGeneratingPVLiveLink => {
        if ( isGeneratingPVLiveLink ) {
          setTimeout(() => {
            // workaround https://github.com/angular/material2/issues/5268
            this.dialog.open( Modal  , {
              width: '60vw',
              height: '50vh',
              data: this.pvLiveModalData,
            });
          }, 0 );

        }
    });

    this.lauchSupPV2 = this.isGeneratePVLiveLinkSuccess$
      .subscribe( _ => {
        if ( this.isGeneratePVLiveLinkSuccess ) {
          this.pvLiveModalData.isGenerateLinkSuccess = this.isGeneratePVLiveLinkSuccess;
          this.pvLiveModalData.selectedRules = this.selectedRules;
          this.pvLiveModalData.link = this.generatedLivePVLink;
        }
    });
  }

  ngOnDestroy () {
    this.lauchSupPV1.unsubscribe();
    this.lauchSupPV2.unsubscribe();
  }

  ngAfterContentInit () {
    this.boardWidth = this.boardElRef.nativeElement.offsetWidth - this.marginOffset;
    // removed for now:
    // => a dialog box to choose a group/class after the view is init
    // if ( !this.selectedClass ) {
    //   this.classDialogRef = this.dialog.open( Modal, {
    //     width: '90vw',
    //     height: '90vh',
    //     disableClose: true,
    //     data: {
    //       classes: this.classes ? this.classes.byId : null,
    //       selectClassHandler: null,
    //       component: ClassManagerComponent,
    //     },
    //   });
    // }

    // this.classes$.subscribe( _ => {
    //   if ( this.classes && this.classes.allIds ) {
    //     this.classDialogRef.comp        onentInstance.data = {
    //       ...this.classDialogRef.componentInstance.data,
    //       classes: this.classes.byId,
    //       selectClassHandler: this.onSelectClassDialog.bind( this ),
    //     };
    //   }
    // });
  }

  handleUserMoreMenuClick ({ user, /*action*/ }) {
    // workaround https://github.com/angular/material2/issues/5268
    setTimeout(() => {
      this.dialog.open( Modal, {
        width: '95vw',
        height: '100vh',
        data: {
          user,
          component: UserDetailComponent,
          modulesData: ( this.selectedClass ?
            ( this.classes.byId[this.selectedClass.id] ?
              this.classes.byId[this.selectedClass.id].modules : []) : []),
          hoverWidgetTraceHandler: this.hoverWidgetTraceHandler,
          hotPrintWidgetHandler: this.hotPrintWidgetHandler,
        },
      });
    }, 0 );

    // Trace purpose
    this.openUserDialogTraceHandler.emit( user );
  }

  onSelectClassDialog ( className: string ) {
    if ( this.classDialogRef ) {
      this.classDialogRef.close();
    }
    this.selectClassHandler.emit( className );
  }

  compareProgressionHandler () {
    this.isProgTableCompare = !this.isProgTableCompare;
  }

  rankUsersHandler () {
    this.isProgTableRank = !this.isProgTableRank;
  }

  showFiltersHandler () {
    this.isProgTableFilter = !this.isProgTableFilter;
  }

  @Input()
  set classes ( value ) {
    this.classes$.next( value );
  }

  get classes () {
    return this.classes$.getValue();
  }

  @Input()
  set isGeneratingPVLiveLink ( value ) {
    this.isGeneratingPVLiveLink$.next( value );
  }

  get isGeneratingPVLiveLink () {
    return this.isGeneratingPVLiveLink$.getValue();
  }

  @Input()
  set generatedLivePVLink ( value ) {
    this.generatedLivePVLink$.next( value );
  }

  get generatedLivePVLink () {
    return this.generatedLivePVLink$.getValue();
  }

  @Input()
  set isGeneratePVLiveLinkSuccess ( value ) {
    this.isGeneratePVLiveLinkSuccess$.next( value );
  }

  get isGeneratePVLiveLinkSuccess () {
    return this.isGeneratePVLiveLinkSuccess$.getValue();
  }

  get _userListData () {
    return get( this.classes, `byId.${this.selectedClass}.id.users`, []);
  }
}

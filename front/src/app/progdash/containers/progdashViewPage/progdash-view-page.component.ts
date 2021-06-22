import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, from, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

/* tslint:disable component-selector  */
@Component({
  selector: 'ProgdashViewPage',
  template: `
    <div class="loading" *ngIf="isLoading$ | async">
      <mat-progress-bar mode="indeterminate" color="#ffd740"></mat-progress-bar>
    </div>
    <ProgdashManager
      [isDataLoaded]="isDataLoaded$ | async"
      [isProgTableOpened]="isProgTableOpened$ | async"
      [isProgEvaluationOpened]="isProgEvaluationOpened$ | async"
      [isStartPrintReport]="isStartPrintReport$ | async"
      [isGeneratingPVLiveLink]="isGeneratingPVLiveLink$ | async"
      [isGeneratePVLiveLinkSuccess]="isGeneratePVLiveLinkSuccess$ | async"
      [generatedLivePVLink]="generatedLivePVLink$ | async"

      [classes]="classes$ | async"
      [selectedClass]="selectedClass$ | async"
      [selectedTimescale]="selectedTimescale$ | async"
      [selectedRules]="selectedRules$ | async"
      [selectedWidgets]="selectedWidgets$ | async"

      (selectClassHandler)="onSelectClass($event)"
      (timescaleHandler)="onTimescaleChange($event)"
      (openProgTableHandler)="onOpenProgTable($event)"
      (openProgEvaluationHandler)="onOpenProgEvaluation()"
      (openProgBoardHandler)="onOpenProgBoard()"

      (checkRuleHandler)="onCheckRule($event)"
      (launchPVLiveHandler)="onLaunchPVLive($event)"
      (generatePVLiveLinkHandler)="onGeneratePVLiveLinkHandler($event)"
      (cancelPVLiveHandler)="onCancelPVLive()"

      (startPrintReportHandler)="onStartPrintReport()"
      (closePrintReportHandler)="onClosePrintReport()"
      (checkWidgetHandler)="onCheckWidget($event)"
      (printReportHandler)="onPrintReport($event)"
      (hotPrintWidgetHandler)="onHotPrintWidget($event)"

      (sortColumnTraceHandler)="onSortColumnTrace($event)"
      (filterColumnTraceHandler)="onFilterColumnTrace($event)"
      (openUserDialogTraceHandler)="onOpenUserDialogTrace($event)"
      (hoverWidgetTraceHandler)="onHoverWidgetTrace($event)"
      (moreRuleClickHandler)="onMoreRuleClickHandler($event)"
      (navigateToSuiviStatsHandler)="onNavigateToSuiviStats()"
      (signOutHandler)="onSignOut()"
      (exportTableToCsvHandler)="onExportTableToCsv($event)">
    </ProgdashManager>
  `,
})
export class ProgdashViewPageComponent implements OnInit {

  isDataLoaded$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isStartPrintReport$: Observable<boolean>;
  isProgTableOpened$: Observable<boolean>;
  isProgEvaluationOpened$: Observable<boolean>;
  classes$: Observable<any>;
  selectedClass$: Observable<string>;
  selectedTimescale$: Observable<string> = from( 'lastWeek' );
  selectedRules$: Observable<string[]>;
  selectedWidgets$: Observable<string[]>;

  isGeneratingPVLiveLink$: Observable<boolean>;
  isGeneratePVLiveLinkSuccess$: Observable<boolean>;
  generatedLivePVLink$: Observable<string>;

  constructor ( private store: Store<fromStore.State> ) {
    this.isLoading$ = this.store.pipe( select( fromStore.isLoading ));
    this.isProgTableOpened$ = this.store.pipe(
      select( fromStore.isProgTableOpened )
    );
    this.isStartPrintReport$ = this.store.pipe(
      select( fromStore.isStartPrintReport )
    );
    this.isProgEvaluationOpened$ = this.store.pipe(
      select( fromStore.isProgEvaluationOpened )
    );
    this.classes$ = this.store.pipe( select( fromStore.classes ));
    this.selectedClass$ = this.store.pipe( select( fromStore.selectedClass ));
    this.selectedTimescale$ = this.store.pipe(
      select( fromStore.selectedTimescale )
    );
    this.selectedRules$ = this.store.pipe( select( fromStore.selectedRules ));
    this.selectedWidgets$ = this.store.pipe( select( fromStore.selectedWidgets ));

    this.isGeneratingPVLiveLink$ = this.store.pipe(
      select( fromStore.isGeneratingPVLiveLink )
    );
    this.isGeneratePVLiveLinkSuccess$ = this.store.pipe(
      select( fromStore.isGeneratePVLiveLinkSuccess )
    );
    this.generatedLivePVLink$ = this.store.pipe(
      select( fromStore.generatedLivePVLink )
    );
  }

  ngOnInit (): void {
    // MOCK FROM CSV
    // this.store.dispatch( new fromStore.LoadData());

    this.store.dispatch( new fromStore.LoadGroupsData());
  }

  onTimescaleChange ( timescale: string ) {
    this.store.dispatch( new fromStore.SelectTimescale( timescale ));
  }

  onSelectClass ( className: any ) {
    this.store.dispatch( new fromStore.SelectClass( className ));
  }

  onOpenProgTable ({ id }) {
    this.store.dispatch( new fromStore.OpenProgTable( id ));
  }

  onOpenProgBoard () {
    this.store.dispatch( new fromStore.OpenProgBoard( ));
  }

  onOpenProgEvaluation () {
    this.store.dispatch( new fromStore.OpenProgEvaluation( ));
  }

  onCheckRule ({ isChecked, ruleId }) {
    this.store.dispatch( new fromStore.CheckRule({ isChecked, ruleId }));
  }

  onLaunchPVLive ( event: string[]) {
    this.store.dispatch( new fromStore.LaunchPVLive({ lessons: event }));
  }

  onGeneratePVLiveLinkHandler ( event: string[]) {
    this.store.dispatch( new fromStore.GeneratePVLiveLink({ lessons: event }));
  }

  onCancelPVLive () {
    this.store.dispatch( new fromStore.CancelPVLive( ));
  }

  onStartPrintReport () {
    this.store.dispatch( new fromStore.StartPrintReport( ));
  }

  onClosePrintReport () {
    this.store.dispatch( new fromStore.ClosePrintReport( ));
  }

  onCheckWidget ({ isChecked, widgetId }) {
    this.store.dispatch( new fromStore.CheckWidget({ isChecked, widgetId }));
  }

  onPrintReport ( selectedWidgets ) {
    this.store.dispatch( new fromStore.PrintReport( selectedWidgets ));
  }

  onSortColumnTrace ( payload ) {
    this.store.dispatch( new fromStore.SortColumn( payload ));
  }

  onFilterColumnTrace ( payload ) {
    this.store.dispatch( new fromStore.FilterColumn( payload ));
  }

  onOpenUserDialogTrace ( payload ) {
    this.store.dispatch( new fromStore.OpenUserDialog( payload ));
  }

  onHoverWidgetTrace ( payload ) {
    this.store.dispatch( new fromStore.HoverWidget( payload ));
  }

  onHotPrintWidget ( payload ) {
    this.store.dispatch( new fromStore.HotPrintWidget( payload ));
  }

  onMoreRuleClickHandler ( payload ) {
    this.store.dispatch( new fromStore.MoreRuleClick( payload ));
  }

  onNavigateToSuiviStats () {
    this.store.dispatch( new fromStore.NavigateToSuiviStats({ from: 'menuPage' }));
  }

  onSignOut () {
    this.store.dispatch( new fromStore.SignOut());
  }

  onExportTableToCsv ({ tableName, data }) {
    this.store.dispatch( new fromStore.ExportTableToCsv({ tableName, data }));
  }
}

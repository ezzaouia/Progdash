import { Action } from '@ngrx/store';

export enum DashActionTypes {
  LoadUserInfo = '[Dash] Load User Info',

  LoadData = '[Dash] Load Data',
  LoadDataSuccess = '[Dash] Load Data Success',
  LoadDataFailure = '[Dash] Load Data Failure',

  LoadGroupsData = '[Dash] Load Groups Data',
  LoadGroupsDataSuccess = '[Dash] Load Groups Data Success',
  LoadGroupsDataFailure = '[Dash] Load Groups Data Failure',

  LoadGroupData = '[Dash] Load Group Data',
  LoadGroupDataSuccess = '[Dash] Load Group Data Success',
  LoadGroupDataFailure = '[Dash] Load Group Data Failure',

  RunDataPrep = '[Dash] Run Data Prep',
  RunDataPrepComplete = '[Dash] Run Data Prep Complete',

  SelectClass = '[Dash] Select Class',
  SelectTimescale = '[Dash] Select Timescale',
  OpenProgTable = '[Dash] Open Prog Table',
  OpenProgBoard = '[Dash] Open Prog Board',
  OpenProgEvaluation = '[Dash] Open Prog Evaluation',

  CheckRule = '[Dash] Check Rule',

  GeneratePVLiveLink = '[Dash] Generate PV Live',
  GeneratePVLiveLinkSuccess = '[Dash] Generate PV Live Success',
  GeneratePVLiveLinkFailure = '[Dash] Generate PV Live Failure',
  LaunchPVLive = '[Dash] Launch PV Live',
  CancelPVLive = '[Dash] Cancel PV Live',

  StartPrintReport = '[Dash] Start Print Report',
  ClosePrintReport = '[Dash] Close Print Report',
  CheckWidget = '[Dash] Check Widget',
  PrintReport = '[Dash] Print Report',
  HotPrintWidget = '[Dash] Hot Print Widget',

  PrintReportSuccess = '[Dash] Print Report Success',
  PrintReportFailure = '[Dash] Print Report Failure',
  Empty = '[Dash] Empty',
  NavigateToHome = '[Dash] Navigate To Home',
  NavigateToSuiviStats = '[Dash] Navigate Suivi Stats',
  SignOut = '[Dash] Sign Out',
  ExportTableToCsv = '[Dash] Export Table To Csv',
  ExportTableToCsvSuccess = '[Dash] Export Table To Csv Success',
  ExportTableToCsvFailure = '[Dash] Export Table To Csv Failure',

  // For tracing purpose
  SortColumn = '[Dash] Sort Column',
  FilterColumn = '[Dash] Filter Column',
  OpenUserDialog = '[Dash] Open User Dialog',
  HoverWidget = '[Dash] Hover Widget',
  MoreRuleClick = '[Dash] More Rule Click',
  GenericFailure = '[Dash] Generic Failure',
}

export class Empty implements Action {
  readonly type = DashActionTypes.Empty;
}

export class GenericFailure implements Action {
  readonly type = DashActionTypes.GenericFailure;

  constructor ( public payload: any  ) {}
}

export class ExportTableToCsvFailure implements Action {
  readonly type = DashActionTypes.ExportTableToCsvFailure;
  constructor ( public payload: any ) {}
}

export class NavigateToHome implements Action {
  readonly type = DashActionTypes.NavigateToHome;
  constructor ( public payload: any  ) {}
}

export class NavigateToSuiviStats implements Action {
  readonly type = DashActionTypes.NavigateToSuiviStats;
  constructor ( public payload: any  ) {}
}

export class SignOut implements Action {
  readonly type = DashActionTypes.SignOut;
}

export class MoreRuleClick implements Action {
  readonly type = DashActionTypes.MoreRuleClick;

  constructor ( public payload: any  ) {}
}

export class LoadData implements Action {
  readonly type = DashActionTypes.LoadData;
}

export class LoadDataSuccess implements Action {
  readonly type = DashActionTypes.LoadDataSuccess;

  constructor ( public payload: any  ) {}
}

export class LoadDataFailure implements Action {
  readonly type = DashActionTypes.LoadDataFailure;

  constructor ( public payload: any ) {}
}

export class LoadGroupsData implements Action {
  readonly type = DashActionTypes.LoadGroupsData;
}

export class LoadGroupsDataSuccess implements Action {
  readonly type = DashActionTypes.LoadGroupsDataSuccess;

  constructor ( public payload: any ) {}
}

export class LoadGroupsDataFailure implements Action {
  readonly type = DashActionTypes.LoadGroupsDataFailure;

  constructor ( public payload: any ) {}
}

export class LoadGroupData implements Action {
  readonly type = DashActionTypes.LoadGroupData;
}

export class LoadGroupDataSuccess implements Action {
  readonly type = DashActionTypes.LoadGroupDataSuccess;

  constructor ( public payload: any ) {}
}

export class LoadGroupDataFailure implements Action {
  readonly type = DashActionTypes.LoadGroupDataFailure;

  constructor ( public payload: any ) {}
}

export class RunDataPrep implements Action {
  readonly type = DashActionTypes.RunDataPrep;
}

export class RunDataPrepComplete implements Action {
  readonly type = DashActionTypes.RunDataPrepComplete;

  constructor ( public payload: any ) {}
}

export class SelectClass implements Action {
  readonly type = DashActionTypes.SelectClass;

  constructor ( public payload: any ) {}
}

export class OpenProgTable implements Action {
  readonly type = DashActionTypes.OpenProgTable;

  constructor ( public payload ?: any ) {}
}

export class OpenProgBoard implements Action {
  readonly type = DashActionTypes.OpenProgBoard;
}

export class OpenProgEvaluation implements Action {
  readonly type = DashActionTypes.OpenProgEvaluation;
}

export class SelectTimescale implements Action {
  readonly type = DashActionTypes.SelectTimescale;

  constructor ( public payload: string ) {}
}

export class CheckRule implements Action {
  readonly type = DashActionTypes.CheckRule;

  constructor ( public payload: { isChecked: boolean; ruleId: string }) {}
}

export class LaunchPVLive implements Action {
  readonly type = DashActionTypes.LaunchPVLive;
  constructor ( public payload: { lessons: string[] }) {}
}

export class GeneratePVLiveLink implements Action {
  readonly type = DashActionTypes.GeneratePVLiveLink;
  constructor ( public payload: { lessons: string[] }) {}
}

export class GeneratePVLiveLinkSuccess implements Action {
  readonly type = DashActionTypes.GeneratePVLiveLinkSuccess;

  constructor ( public payload: string ) {}
}

export class GeneratePVLiveLinkFailure implements Action {
  readonly type = DashActionTypes.GeneratePVLiveLinkFailure;
  constructor ( public payload: any ) {}
}

export class CancelPVLive implements Action {
  readonly type = DashActionTypes.CancelPVLive;
}

export class StartPrintReport implements Action {
  readonly type = DashActionTypes.StartPrintReport;
}

export class ClosePrintReport implements Action {
  readonly type = DashActionTypes.ClosePrintReport;
}

export class CheckWidget implements Action {
  readonly type = DashActionTypes.CheckWidget;

  constructor ( public payload: { isChecked: boolean; widgetId: string }) {}
}

export class PrintReport implements Action {
  readonly type = DashActionTypes.PrintReport;

  constructor ( public payload: string[]) {}
}

export class HotPrintWidget implements Action {
  readonly type = DashActionTypes.HotPrintWidget;

  constructor ( public payload: string ) {}
}

export class PrintReportSuccess implements Action {
  readonly type = DashActionTypes.PrintReportSuccess;

  constructor ( public payload: any ) {}
}

export class PrintReportFailure implements Action {
  readonly type = DashActionTypes.PrintReportFailure;

  constructor ( public payload: string ) {}
}

export class SortColumn implements Action {
  readonly type = DashActionTypes.SortColumn;

  constructor ( public payload: any ) {}
}

export class FilterColumn implements Action {
  readonly type = DashActionTypes.FilterColumn;

  constructor ( public payload: any ) {}
}

export class OpenUserDialog implements Action {
  readonly type = DashActionTypes.OpenUserDialog;

  constructor ( public payload: any ) {}
}

export class HoverWidget implements Action {
  readonly type = DashActionTypes.HoverWidget;

  constructor ( public payload: any ) {}
}

export class LoadUserInfo implements Action {
    readonly type = DashActionTypes.LoadUserInfo;

    constructor ( public payload: {userId: number, areaId: number}) {}
}

export class ExportTableToCsv implements Action {
  readonly type = DashActionTypes.ExportTableToCsv;

  constructor ( public payload: {tableName: string, data: Array<any>}) {}
}

export class ExportTableToCsvSuccess implements Action {
  readonly type = DashActionTypes.ExportTableToCsvSuccess;

  constructor ( public payload: any ) {}
}

export type DashActionsUnion =
  | LoadData
  | LoadDataSuccess
  | LoadDataFailure
  | LoadGroupsData
  | LoadGroupsDataSuccess
  | LoadGroupsDataFailure

  | LoadGroupData
  | LoadGroupDataSuccess
  | LoadGroupDataFailure

  | RunDataPrep
  | RunDataPrepComplete
  | SelectClass
  | SelectTimescale
  | OpenProgTable
  | OpenProgBoard
  | OpenProgEvaluation
  | CheckRule
  | LaunchPVLive
  | CancelPVLive
  | StartPrintReport
  | ClosePrintReport
  | CheckWidget
  | PrintReport
  | PrintReportSuccess
  | PrintReportFailure
  | SortColumn
  | FilterColumn
  | OpenUserDialog
  | HoverWidget
  | HotPrintWidget
  | LoadUserInfo
  | Empty
  | GeneratePVLiveLink
  | GeneratePVLiveLinkFailure
  | GeneratePVLiveLinkSuccess
  | MoreRuleClick
  | NavigateToHome
  | NavigateToSuiviStats
  | SignOut
  | ExportTableToCsv
  | ExportTableToCsvSuccess
  | ExportTableToCsvFailure
  | GenericFailure;

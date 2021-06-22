import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, throttleTime, catchError } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";

import { DashActionTypes } from "../actions";
import { TraceService } from "../../services/trace.service";
import { ErrorsService } from "../../../shared/services";
import { GenericFailure } from "../actions";

/**
 * Effect to collecte all traces (users' interactions)
 * needed for the experiment.
 * The methods must be passive { dispatch: false },
 * the main task is to listen and call LogfileService.
 * This is very practical as we can listen for ngrx
 * dispatched actions that we want to log in one bit.
 */
@Injectable()
export class TraceEffects {
  constructor(
    private actions$: Actions,
    private traceService: TraceService,
    private errorService: ErrorsService
  ) {}

  @Effect({ dispatch: false })
  TraceActions$: Observable<Action> = this.actions$.pipe(
    ofType(
      // DATA
      DashActionTypes.LoadGroupData,
      DashActionTypes.LoadGroupsData,

      // VIEWS
      DashActionTypes.SelectClass,
      DashActionTypes.SelectTimescale,
      DashActionTypes.OpenProgTable,
      DashActionTypes.OpenProgBoard,
      DashActionTypes.OpenProgEvaluation,

      // PRINT REPORT
      DashActionTypes.StartPrintReport,
      DashActionTypes.ClosePrintReport,
      DashActionTypes.CheckWidget,
      DashActionTypes.PrintReport,
      DashActionTypes.HotPrintWidget,
      DashActionTypes.PrintReportSuccess,

      // PV LIVE
      DashActionTypes.CheckRule,
      DashActionTypes.LaunchPVLive,
      DashActionTypes.CancelPVLive,

      // TABLE
      DashActionTypes.SortColumn,
      DashActionTypes.FilterColumn,

      // User dialog
      DashActionTypes.OpenUserDialog,
      DashActionTypes.MoreRuleClick,

      // page view
      DashActionTypes.LoadUserInfo,
      DashActionTypes.NavigateToHome,
      DashActionTypes.NavigateToSuiviStats,
      DashActionTypes.SignOut,

      // Export CSV,
      DashActionTypes.ExportTableToCsv,
      DashActionTypes.ExportTableToCsvSuccess
      // ...,
      // ...,
      // ...,
    ),
    tap(action => {
      console.log("***TRACE***", action);

      this.traceService.createTrace(action);
    }),
    catchError(err => {
      return of(new GenericFailure(err));
    })
  );

  @Effect({ dispatch: false })
  debounceActions$: Observable<Action> = this.actions$.pipe(
    ofType(DashActionTypes.HoverWidget),
    throttleTime(5 * 60 * 1000),
    tap(action => {
      console.log("***TRACE***", action);
      this.traceService.createTrace( action );
    }),
    catchError(err => {
      return of(new GenericFailure(err));
    })
  );

  @Effect({ dispatch: false })
  ErrorsActions$: Observable<any> = this.actions$.pipe(
    ofType(
      DashActionTypes.LoadGroupsDataFailure,
      DashActionTypes.LoadGroupDataFailure,
      DashActionTypes.PrintReportFailure,
      DashActionTypes.GeneratePVLiveLinkFailure,
      DashActionTypes.GenericFailure,
      DashActionTypes.ExportTableToCsvFailure
    ),
    tap(action => {
      console.log("***ERROR***", action);
      this.errorService.log( action.payload, action.type );
    })
  );
}

import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { NotificationService } from "./notification.service";
import { ErrorsService } from "./errors.service";

// source https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(
    // Because the ErrorHandler is created before
    // the providers, we’ll have to use the Injector to get them.
    private injector: Injector
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    const notificationService = this.injector.get(NotificationService);
    const router = this.injector.get(Router);
    const errorsService = this.injector.get(ErrorsService);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        notificationService.notifyOffline();
      } else if (error.status === 401 || error.status === 403) {
        // router.navigate([ '/unauthorized' ]);
        // router.navigate([
        //   '/externalSuiviStatsRedirect',
        //   {
        //     externalUrl: `${environment.SUIVI_STATS_URL}/guard/logout'`,
        //     isSelf : true,
        //   } ],
        //   { skipLocationChange: false }
        // );
      } else {
        // http errors
        // router.navigate([ '/error' ]);
      }
    } else {
      // app errors
      // noop
    }
    // Log the error anyway
    errorsService.log(error);
  }
}

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as StackTraceParser from 'error-stack-parser';

import { NotificationService } from './notification.service';

@Injectable()
export class ErrorsService {
  constructor ( private notificationService: NotificationService ) {}

  log ( error, actionType? ) {
    this.notificationService.error( this.prettify( error ),  actionType );
  }

  prettify ( error ) {
    const name = error.name || null;
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse( error );
    return {
      name,
      status,
      message,
      stack,
    };
  }
}

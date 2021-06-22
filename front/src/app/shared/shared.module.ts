import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';

import { MaterialModule } from '../material';

import { fromComponents, fromEntryComponents } from './components';
import {
  InteractionsService,
  DataService,
  ErrorsHandler,
  ServerErrorsInterceptor,
  NotificationService,
  ErrorsService,
} from './services';
import { FormatTimePipe, ValuesPipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    DynamicModule.withComponents( fromEntryComponents ),
  ],
  declarations: [ ...fromComponents ],
  entryComponents: [ ...fromEntryComponents ],
  providers: [
    InteractionsService,
    DataService,
    FormatTimePipe,
    ErrorsService,
    NotificationService,
    ValuesPipe,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ...fromComponents,
  ],
})
export class SharedModule {}

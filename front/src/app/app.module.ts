import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppStoreModule } from './store';
import { SharedModule } from './shared';
import { RootComponent } from './shared/components';
import { AppRoutingModule } from './app-routing.module';

import { TableModule } from './table';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    DeviceDetectorModule.forRoot(),

    AppStoreModule,
    SharedModule,
    TableModule,

    AppRoutingModule,
  ],
  exports: [],
  bootstrap: [ RootComponent ],
})
export class AppModule {
  constructor ( router: Router ) {
      console.log( 'Routes: ', JSON.stringify( router.config, undefined, 2 ));
  }
}

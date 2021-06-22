import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DynamicModule } from 'ng-dynamic-component';
import { GridsterModule } from 'angular-gridster2';
import { HttpModule } from '@angular/http';


import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { VisualizationModule } from '../visualization';
import { TableModule } from '../table';
import { DashRoutingModule } from './progdash.routes';

import { fromComponents, fromEntryComponents } from './components';
import * as fromStore from './store';
import { fromSerices } from './services';


@NgModule({
  imports: [
    HttpModule,
    SharedModule,

    GridsterModule,
    DynamicModule,

    MaterialModule,
    VisualizationModule,
    TableModule,
    DashRoutingModule,

    StoreModule.forFeature( 'progdash', fromStore.reducers ),
    EffectsModule.forFeature( fromStore.effects ),
  ],
  providers: [ ...fromSerices ],
  entryComponents: [ ...fromEntryComponents ],
  declarations: [ ...fromComponents ],
  exports: [ ...fromComponents ],
})
export class ProgdashModule { }

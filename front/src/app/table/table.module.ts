import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material';
import { VisualizationModule } from '../visualization';
import { TableRoutingModule } from './table.routes';

import { fromComponents } from './components';


@NgModule({
  imports: [
    SharedModule,

    DynamicModule,

    MaterialModule,
    VisualizationModule,
    // TableRoutingModule, // use this if you want to test table module standalone
  ],
  declarations: [ ...fromComponents ],
  exports: [ ...fromComponents ],
})
export class TableModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { fromComponents } from './components';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [ ...fromComponents ],
  exports: [ ...fromComponents ],
})
export class VisualizationModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableViewPageComponent } from './containers';

export const tableRoutes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: 'table',
    component: TableViewPageComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild( tableRoutes ) ],
  exports: [ RouterModule ],
})
export class TableRoutingModule { }

import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

import { ProgdashViewPageComponent } from './containers';
import { NotFoundComponent } from '../shared/components';

const externalUrlProvider = new InjectionToken( 'externalUrlRedirectResolver' );

export const dashRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'prog',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: ProgdashViewPageComponent,
  },
];

@NgModule({
  imports: [ RouterModule.forChild( dashRoutes ) ],
  exports: [ RouterModule ],
})
export class DashRoutingModule {}

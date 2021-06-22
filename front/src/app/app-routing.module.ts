import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { environment } from '../environments/environment';
import {
  NotFoundPageComponent,
  HomePageComponent,
  ErrorPageComponent,
  UnauthorizedPageComponent
} from './shared/components';


export const AppRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'suivi',
        loadChildren: './progdash/progdash.module#ProgdashModule',
      },
      {
        path: '',
        redirectTo: 'suivi',
        pathMatch: 'full',
      },
      {
        path: 'externalPVRedirect',
        canActivate: [ 'externalUrlProvider' ],
        component: NotFoundPageComponent,
      },
      {
        path: 'externalSuiviStatsRedirect',
        canActivate: [ 'externalUrlProvider' ],
        component: NotFoundPageComponent,
      },
      {
        path: 'unauthorized',
        component: UnauthorizedPageComponent,
      },
    ],
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  providers: [
    {
      provide: 'externalUrlProvider',
      useValue: ( route: ActivatedRouteSnapshot ) => {
        const externalUrl = route.paramMap.get( 'externalUrl' );
        const isSelf = route.paramMap.get( 'isSelf' );
        window.open( externalUrl, isSelf ? '_self' : '_blank' );
      },
    },
  ],
  imports: [
    RouterModule.forRoot( AppRoutes, {
      useHash: true,
      enableTracing: !environment.production,
    }),
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}

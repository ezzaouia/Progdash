import { RootComponent } from './root';
import { ContainerComponent } from './container';
import { NavbarComponent } from './navbar';
import { HomeViewComponent } from './homeView';
import { NotFoundComponent } from './notfound';
import { ErrorComponent } from './error';
import { Modal } from './modal';
import { PrintWidgetComponent } from './printWidget';
import { ErrorLandingComponent } from './errorLanding';
import { NoInternetComponent } from './noInternet';
import { UnauthorizedComponent } from './unauthorized';
import {
  HomePageComponent,
  NotFoundPageComponent,
  ErrorPageComponent,
  UnauthorizedPageComponent
} from '../containers';
import { FormatTimePipe, ValuesPipe } from '../pipes';
import { SnackNotifyComponent } from './snackNotify';

export const fromComponents: any[] = [
  RootComponent,
  HomePageComponent,
  NotFoundPageComponent,
  ContainerComponent,
  NavbarComponent,
  HomeViewComponent,
  NotFoundComponent,
  ErrorPageComponent,
  ErrorComponent,
  Modal,
  PrintWidgetComponent,
  SnackNotifyComponent,
  ErrorLandingComponent,
  NoInternetComponent,
  UnauthorizedPageComponent,
  UnauthorizedComponent,

  FormatTimePipe,
  ValuesPipe,
];

export const fromEntryComponents: any[] = [
  Modal,
  PrintWidgetComponent,
  SnackNotifyComponent,
  ErrorLandingComponent,
  NoInternetComponent,
];

export * from './root';
export * from './notfound';
export * from './error';
export * from './modal';
export * from './printWidget';
export * from './errorLanding';
export * from './noInternet';
export * from '../containers';

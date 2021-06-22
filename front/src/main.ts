import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app';
import { environment } from './environments/environment';

import { hmrBootstrap } from './hmr';

if ( environment.production ) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule( AppModule );

if ( environment.production ) {
  if ( window ) {
    window.console.groupCollapsed = () => {};
    window.console.groupEnd = () => {};
    window.console.info = () => {};
    window.console.log = () => {};
    window.console.debug = () => {};
    window.console.error = () => {};
    window.console.trace = () => {};
  }
}

if ( environment.hmr ) {
  if ( module[ 'hot' ]) {
    hmrBootstrap( module, bootstrap );
  } else {
    console.error( 'HMR is not enabled for webpack-dev-server!' );
    console.log( 'Are you using the --hmr flag for ng serve?' );
  }
} else {
  bootstrap();
}

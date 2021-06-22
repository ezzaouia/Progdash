import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../progdash/store';

@Component({
  selector: 'app-not-found-page',
  template: `
    <app-error
      (navigateToHomeHandler)="onNavigateToHome()"
      (navigateToSuiviStatsHandler)="onNavigateToSuiviStats()">
    </app-error>
  `,
  styles: [ `` ],
})
export class ErrorPageComponent implements OnInit {

  constructor ( private store: Store<fromStore.State> ) { }

  ngOnInit (): void { }

  onNavigateToHome () {
    this.store.dispatch( new fromStore.NavigateToHome({ page: 'errorPage' }));
  }

  onNavigateToSuiviStats () {
    this.store.dispatch( new fromStore.NavigateToSuiviStats({ page: 'errorPage' }));
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../progdash/store';

@Component({
  selector: 'app-not-found-page',
  template: `
    <app-notfound
      (navigateToHomeHandler)="onNavigateToHome()"
      (navigateToSuiviStatsHandler)="onNavigateToSuiviStats()">
    </app-notfound>
  `,
  styles: [ `` ],
})
export class NotFoundPageComponent implements OnInit {

  constructor ( private store: Store<fromStore.State> ) { }

  ngOnInit (): void { }

  onNavigateToHome () {
    this.store.dispatch( new fromStore.NavigateToHome({ page: 'notFoundPage' }));
  }

  onNavigateToSuiviStats () {
    this.store.dispatch( new fromStore.NavigateToSuiviStats({ page: 'notFoundPage' }));
  }
}

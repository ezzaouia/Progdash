import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../progdash/store';

@Component({
  selector: 'app-not-unauthorized-page',
  template: `
    <app-unauthorized
      (signOutHandler)="onSignOut()">
    </app-unauthorized>
  `,
  styles: [ `` ],
})
export class UnauthorizedPageComponent implements OnInit {

  constructor ( private store: Store<fromStore.State> ) { }

  ngOnInit (): void { }

  onSignOut () {
    this.store.dispatch( new fromStore.SignOut());
  }
}

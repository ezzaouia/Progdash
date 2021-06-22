import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
      <mat-toolbar>
        <ng-content></ng-content>
      </mat-toolbar>
    `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-toolbar {
        height: 46px;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        // box-shadow: 2px 0px 5px rgba(17, 17, 17, 0.06);
      }
    `,
  ],
})
export class NavbarComponent {
  @Output() goLogin = new EventEmitter();
}

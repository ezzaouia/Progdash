import { Component } from '@angular/core';


@Component({
  selector: 'app-container',
  template: `
      <router-outlet></router-outlet>
    `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ContainerComponent { }

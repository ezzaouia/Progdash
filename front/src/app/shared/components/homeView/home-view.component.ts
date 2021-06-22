import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-view',
  template: `
    <ng-content select="app-navbar"></ng-content>
    <ng-content select="app-container"></ng-content>
  `,
  styles: [ `` ],
})
export class HomeViewComponent implements OnInit {
  constructor () { }

  ngOnInit (): void { }


}

import { Component, OnInit, Input } from '@angular/core';

/* tslint:disable component-selector  */
@Component({
  selector: 'ProgdashView',
  template: `
  <!-- toolbar -->
  <ng-content select=".toolbar"></ng-content>
  <mat-drawer-container class="container">
    <mat-drawer
      disableClose
      mode="side"
      [opened]="isSidenavOpened"
      class="sidenav mat-elevation-z2">
      <!-- user list content
      <ng-content select=".sidenav"></ng-content> -->
      <!-- sidebar users detail
      <ng-content select=".prog-table"></ng-content> -->
    </mat-drawer>
    <mat-drawer-content
      class="content"
      [ngStyle]="{
        'margin-left': isSidenavOpened ? 0 : 'auto',
        'margin-right': isSidenavOpened ? 0 : 'auto',
        'width.vw': 100
      }">
      <!-- prog dash content -->
      <ng-content select=".board"></ng-content>
    </mat-drawer-content>
  </mat-drawer-container>
  `,
  styles: [ `
    :host {
      display: block;
    }
    .container {
      width: 100vw;
      height: calc(100vh - 46px);
      margin-top: 46px;
    }
    mat-drawer-content {
      overflow: hidden;
    }
    .sidenav {
      width: 0px; /* 300px;*/
      height: 100vh;
    }
    .content {
      width: 100vw;/*calc(100vw - 300px);*/
    }
  ` ],
})
export class ProgdashViewComponent implements OnInit {
  @Input() isSidenavOpened;

  constructor () { }

  ngOnInit (): void { }

}

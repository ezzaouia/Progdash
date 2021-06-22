import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'UserTimelineWidget',
  template: `
    <mat-card
      id="learner-line-chart"
      class="widget-card line-widget">
      <mat-card-header>
        <mat-card-title>Progression dans le temps</mat-card-title>
      </mat-card-header>
      <mat-card-content #lineWidget>
        <MlineChart
          *ngIf="lineWidget.offsetWidth && lineWidget.offsetHeight"
          [data]="[userData]"
          [modulesData]="modulesData"
          [width]="lineWidget.offsetWidth"
          [height]="lineWidget.offsetHeight"
          [timeScale]="'day'"
          [ykey]="'sumscore'">
        </MlineChart>
      </mat-card-content>
    </mat-card>
  `,
  styles: [ `
    :host {
      display: flex;
      width: calc(100% - 0px);
      height: calc(100% - 0px);
    }
    .widget-card {
      padding: 0px;
      box-sizing: border-box;
    }
    mat-card-content {
      width: 100%;
      height: 90%;
    }
    mat-card-header {
      box-sizing: border-box;
    }
    .line-widget {
      width: 100%;
      height: 100%;
      padding: 12px 0px;
      box-sizing: border-box;
    }
  ` ],
})
export class UserTimelineWidgetComponent implements OnInit {

  @Input() title;
  @Input() userData;
  @Input() offsetWidth;
  @Input() modulesData: {}[];

  constructor () { }

  ngOnInit (): void { }
}

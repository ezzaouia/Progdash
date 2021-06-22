import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { get } from 'lodash';
import * as moment from 'moment';
import 'moment-duration-format';

/* tslint:disable component-selector  */
@Component({
  selector: 'InfoWidget',
  template: `
    <mat-card class="widget-card" id="{{id}}">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
        <PrintWidget
          *ngIf="isStartPrintReport"
          [widgetId]="id"
          [checked]="selectedWidgets.includes(id)"
          (checkWidgetHandler)="checkWidgetHandler.emit($event)">
        </PrintWidget>
      </mat-card-header>
      <mat-card-content>
        <div class="item-detail">
          <div class="item">
              <span class="item-sum">
                {{ sum | formatAttr:key }}
                <span *ngIf="count"> /{{ count }}</span>
              </span>
              <span class="item-label">{{ infoLabel }}</span>
          </div>
          <div class="item" *ngIf="sign">
              <DetlaWidget
                [sign]="sign"
                [data]="sumd | formatAttr:key">
              </DetlaWidget>
              <span class="item-label">par rapport aux {{ timescaleLabel }}</span>
          </div>
        </div>
      </mat-card-content>
  </mat-card>
  `,
  styles: [ `
    :host {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .widget-card {
      width: 100%;
      height: 100%;
      padding: 12px;
      box-sizing: border-box;
    }
    mat-card-content {
      padding: 12px 0px;
      height: 80%;
    }
    .item-detail {
      flex-direction: column;
      height: 95%;
      width: 100%;
      justify-content: space-between;
    }
    .item {
      display: flex;
      align-items: flex-start;
      width: 100%;
      height: 50%;
    }
    .item-sum {
      font-size: 24px;
      font-weight: 500;
      margin-right: 6px;
      font-size: 24px;
      font-weight: 500;
      margin-right: 6px;
      white-space: nowrap;
      display: block;
    }
    .item-delta {
      display: flex;
    }
    .item-label {
      font-size: 13px;
      margin-top: 6px;
    }
    .item-sumd {
      display: flex;
      align-items: center;
      border: 1px solid #eee;
      border-radius: 10px;
      justify-content: center;
      background: #eee;
      width: 80px;
      margin-right: 6px;
      font-size: 12px;
    }
    ` ],
})
export class InfoWidgetComponent implements OnInit {
  @Input() title;
  @Input() infoLabel;
  @Input() timescaleLabel;
  @Input() key;
  @Input() id;
  @Input() sum;
  @Input() sumd;
  @Input() count;
  @Input() sign;
  @Input() isStartPrintReport;
  @Input() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();
  @Input() selectedWidgets: string[];

  constructor () {}

  ngOnInit (): void {}
}

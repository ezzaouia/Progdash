import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { size } from 'lodash';

/* tslint:disable component-selector  */
@Component({
  selector: 'TopNUsersWidget',
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
        <mat-list role="list">
        <mat-divider></mat-divider>
        <div
          class="list-item"
          *ngFor="let item of data">
            <div class="list-item-content">
              <span> {{ users[item.id].fullName }} </span>
              <div class="item-detail">
                <span class="item-sum">
                  {{ item.sum.sum | formatAttr:key }}
                </span>
                <DetlaWidget
                  [sign]="(item.sum.sumd >= 0 ? 'plus' : 'minus')"
                  [data]="(item.sum.sumd | mathAbs) | formatSumd:key">
                </DetlaWidget>
              </div>
            </div>
            <mat-divider></mat-divider>
        </div>
      </mat-list>
      </mat-card-content>

      <mat-card-actions
        class="actions">
        <button
          mat-stroked-button
          (click)="openProgTableHandler.emit({ id: id })">
            Plus de Détails
        </button>
      </mat-card-actions>
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
    mat-card-header {
      height: 18px;
    }
    mat-card-content {
      padding: 12px 0px;
      height: 75%;
    }
    .title {
      margin: 12px;
    }
    .list-item {
      height: 60px;
      padding: 0px;
    }
    .list-item-content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      font-size: 16px;
    }
    .item-detail {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .item-sum {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  ` ],
})
export class TopNUsersWidgetComponent implements OnInit {

  @Input() title;
  @Input() data;
  @Input() timescale;
  @Input() key;
  @Input() id;
  @Input() users;
  @Input() isStartPrintReport;
  @Input() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();
  @Input() openProgTableHandler = new EventEmitter();
  @Input() selectedWidgets: string[];


  constructor () { }

  ngOnInit (): void { }

  get isData () {
    return size( this.data ) > 0;
  }
}

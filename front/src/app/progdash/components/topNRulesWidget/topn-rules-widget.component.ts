import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { size } from 'lodash';

/* tslint:disable component-selector  */
@Component({
  selector: 'TopNRulesWidget',
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
                <span class="label">
                    {{ item.name }}
                </span>
                <div class="item-detail"
                  *ngIf="isPVLive">
                  <mat-checkbox
                    class="checkbox"
                    matTooltipPosition="above"
                    matTooltip="Sélectionnez la règle pour le mode présentiel"
                    [disabled]="isStartPrintReport"
                    [checked]="selectedRules.includes( item.id )"
                    (change)="onRuleChecked($event, item.id)">
                  </mat-checkbox>
                </div>
              </div>
              <mat-divider></mat-divider>
          </div>
        </mat-list>
      </mat-card-content>

      <mat-card-actions
        class="actions"
        *ngIf="isData">
          <button
          mat-stroked-button
          matTooltipPosition="above"
          [matTooltipShowDelay]="2000"
          matTooltip="Fonctionnalité en cours de développement"
          (click)="moreRuleClickHandler.emit( id )">
            Plus de règles
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
      box-sizing: border-box;
      padding: 12px;
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
    .label {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 90%;
    }
    .item-detail {
      margin-left: auto;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  ` ],
})
export class TopNRulesWidgetComponent implements OnInit {

  @Input() title;
  @Input() data;
  @Input() key;
  @Input() id;
  @Input() isPVLive;
  @Input() isStartPrintReport;
  @Input() checkRuleHandler = new EventEmitter<{ isChecked: boolean; ruleId: string }>();
  @Input() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();
  @Input() moreRuleClickHandler = new EventEmitter();
  @Input() selectedWidgets: string[];
  @Input() selectedRules: string[];


  constructor () { }

  ngOnInit (): void { }

  onRuleChecked ({ checked: isChecked }: MatCheckboxChange,  ruleId: string ) {
    this.checkRuleHandler.emit({ isChecked, ruleId });
  }

  get isData () {
    return size( this.data ) > 0;
  }

}

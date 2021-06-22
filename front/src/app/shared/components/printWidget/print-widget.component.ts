import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'PrintWidget',
  template: `
    <div
      class="print"
      mat-icon-button>
      <mat-icon class="mat-12" aria-label="print">print</mat-icon>
      <mat-checkbox
        class="checkbox"
        matTooltipPosition="above"
        matTooltip="Ajouter au rapport PDF"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onCheckWidget( $event, widgetId )">
      </mat-checkbox>
    </div>
  `,
  styles: [ `
    :host {
      display: flex;
      margin-left: auto;
    }
    .print {
      position: relative;
      position: relative;
      display: flex;
      align-items: center;
      margin-left: auto;
    }
  ` ],
})
export class PrintWidgetComponent implements OnInit {

  @Input() widgetId: string;
  @Input() checked?: boolean;
  @Input() disabled?: boolean;
  @Output() checkWidgetHandler = new EventEmitter<{ isChecked: boolean; widgetId: string }>();


  constructor () { }

  ngOnInit (): void { }

  onCheckWidget ({ checked: isChecked }: MatCheckboxChange, widgetId: string ) {
    this.checkWidgetHandler.emit({ isChecked, widgetId });
  }
}

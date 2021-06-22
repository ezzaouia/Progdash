import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/* tslint:disable component-selector  */
@Component({
  selector: 'TimescaleMenu',
  template: `
    <mat-button-toggle-group>
      <mat-button-toggle
        value="left"
        [checked]="(selectedTimescale === 'lastWeek' ? true : false)"
        (click)="onTimescaleChange('lastWeek')">
        <div class="timescale-label">
          7 derniers jours
        </div>
      </mat-button-toggle>
      <div class="divider"></div>
      <mat-button-toggle
        value="right"
        [checked]="(selectedTimescale === 'lastMonth' ? true : false)"
        (click)="onTimescaleChange('lastMonth')">
        <div class="timescale-label">
          30 derniers jours
        </div>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styles: [ `
    :host {
      display: block;
    }
    .timescale-label {
      font-size: 13px;
      color: rgba(0,0,0,.87);
    }
    mat-button-toggle-group {
      display: flex;
      justify-content: space-around;
      box-shadow: none;
      align-items: center;
      height: 32px;
    }
    mat-button-toggle {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 130px;
    }
    .divider {
      border: 0.5px solid #ccc;
      height: 100%;
    }

  ` ],
})
export class TimescaleMenuComponent implements OnInit {

  @Input() selectedTimescale: string;
  @Output() timescaleHandler = new EventEmitter();


  constructor () { }

  ngOnInit (): void { }

  onTimescaleChange ( timescale: string ) {
    this.timescaleHandler.emit( timescale );
  }

}

import { Component, OnInit, Input } from '@angular/core';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'DetlaWidget',
  template: `
    <div class="container">
      <mat-icon
        class="sign-icon"
        aria-label="sign"
        [ngClass]="{
          'plus-sign': (sign === 'plus'),
          'minus-sign': (sign === 'minus')
        }">
        {{ sign === 'plus' ? 'add' : 'remove' }}
      </mat-icon>
      <span class="label" >{{ data }}</span>
    </div>
  `,
  styles: [ `
    :host {
      display: block;
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
      border-radius: 12px;
      width: auto;
      height: 22px;
      font-size: 12px;
      padding: 0 6px;
      margin: 6px;
    }
    .label {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: block;
    }
    .sign-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
      line-height: 18px;
    }
    .plus-sign {
      color: #B2FF59;
      transition: transform 0.5s ease;
    }
    .minus-sign {
      color: #FF5252;
      transition: transform 0.5s ease;
    }
  ` ],
})
export class DeltaWidgetComponent implements OnInit {

  @Input() sign: string;
  @Input() data: string;
  @Input() styles?;

  constructor () { }

  ngOnInit (): void { }

}

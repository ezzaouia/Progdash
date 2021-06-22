import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

/* tslint:disable component-selector  */
@Component({
  selector: 'ClassNameMenu',
  template: `
    <button
      mat-menu-item
      [disabled]="(clazz.nbUsers > MAX_NB_USERS)"
      *ngFor="let clazz of classListData"
      (click)="selectClassHandler.emit( clazz )">
        <div class="container">
          <span class="class-name">{{ clazz.name }}</span>
          <span
            class="class-nb-users"
            matTooltip="Nombre d'apprenants">
             #{{ clazz.nbUsers }}
            </span>
        </div>
    </button>
  `,
  styles: [ `
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .class-name, .class-nb-users {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: block;
    }
    .class-name {
      min-width: 120px;
    }
  ` ],
})
export class ClassNameMenuComponent implements OnInit {

  @Output() selectClassHandler = new EventEmitter();
  @Input() classListData;

  MAX_NB_USERS = 110;

  constructor () { }

  ngOnInit (): void { }

}

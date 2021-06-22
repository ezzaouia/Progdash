import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { values } from 'lodash';

/* tslint:disable component-selector  */
@Component({
  selector: 'UserList',
  template: `
    <mat-list role="list"
      data-simplebar
      data-simplebar-auto-hide="false">
      <mat-divider></mat-divider>
      <div
        class="list-item"
        *ngFor="let user of userListData | keyvalue">
          <div class="list-item-content">
            <span class="user-name"> {{ user.value.fullName }} </span>
            <div class="item-detail">
              <span class="item-sum">
                {{ user.value.score.sum | formatAttr:'score' }}/{{ user.value.score.count }}
              </span>
              <DetlaWidget
                [sign]="sign"
                [data]="user.value.insights[timescale].score.sumd | formatAttr:'score'">
              </DetlaWidget>
            </div>
            <button
              mat-icon-button
              [matMenuTriggerFor]="more"
              [matMenuTriggerData]="{ user: user.value }">
                <mat-icon class="mat-12" aria-label="menu">more_vert</mat-icon>
            </button>
          </div>
          <mat-divider></mat-divider>
      </div>
    </mat-list>

    <mat-menu #more="matMenu">
      <ng-template matMenuContent let-user="user">
        <button
          mat-menu-item
          (click)="userMoreMenuHandler.emit({ user: user, action: 'detail' })">
            <span>Détail</span>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styles: [ `
    :host {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    mat-list {
      overflow-x: hidden;
    }
    .title {
      margin: 12px;
    }
    .list-item {
      height: 60px;
    }
    .list-item-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 16px;
      padding: 0 12px;
      box-sizing: border-box;
    }
    .item-detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: auto;
    }
    .item-sum {
      font-size: 14px;
      font-weight: 500;
    }
    .user-name {
      width: 100px;
    }
    .item-sum {
      font-size: 14px;
      font-weight: 500;
    }
    `,
  ],
})
export class UserLisrComponent implements OnInit {
  @Output() userMoreMenuHandler = new EventEmitter();
  @Input() timescale;

  data;
  userListData$ = new BehaviorSubject<any>({});
  dataStream = new BehaviorSubject<any[]>([]);

  constructor () {}

  ngOnInit (): void {
    this.userListData$.subscribe( _ => {
      this.data = values( this.userListData );
      this.dataStream.next( this.data );
    });
  }

  @Input()
  set userListData ( value ) {
    this.userListData$.next( value );
  }

  get userListData () {
    return this.userListData$.getValue();
  }
}

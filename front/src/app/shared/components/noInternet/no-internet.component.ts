import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable, BehaviorSubject, fromEvent, merge, Subscription } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'NoInternet',
  template: `
    <div class="container">
      <div class="sync" *ngIf="isOffline">
        <div class="info">
          <mat-icon
            class="offline-icon"
            aria-label="offline_bolt">
            offline_bolt
          </mat-icon>
          <p>Il semble que vous n'avez pas de connexion internet !</p>
        </div>
        <mat-progress-bar mode="indeterminate" color="red"></mat-progress-bar>
      </div>
      <div class="sync" *ngIf="!isOffline">
        <div class="toolbar">
          <span class="fill"></span>
          <button
            class="fab-button mat-32"
            mat-stroked-button
            (click)="onCloseClick( )">
              <mat-icon aria-label="menu">close</mat-icon>
          </button>
        </div>
        <div class="info">
          <mat-icon
            class="online-icon"
            aria-label="offline_bolt">
            offline_bolt
          </mat-icon>
          <p>Il semble que c'est bon...</p>
        </div>
      </div>
    </div>
  `,
  styles: [ `
    :host {
      width: 100%;
      height: 100%;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 50%;
    }
    .info {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .info p {
      margin-left: 12px;
      text-align: center;
    }
    .sync {
      width: 100%;
      display: flex;
      align-content: center;
      flex-direction: column;
      justify-content: center;
      z-index: 1000;
    }
    .toolbar {
      display: flex;
      align-content: center;
    }
    .offline-icon {
      color: #ccc;
    }
    .online-icon {
      color: green;
    }
  ` ],
})
export class NoInternetComponent implements OnInit, OnDestroy {

  onLineSup: Subscription;
  isOffline$ = new BehaviorSubject( true );

  constructor ( public dialogRef: MatDialogRef<NoInternetComponent> ) {}

  ngOnInit (): void {
    this.onLineSup = merge(
        fromEvent( window, 'offline' ).pipe( map(() => false )),
        fromEvent( window, 'online' ).pipe( map(() => true )),
        Observable.create( sub => {
          sub.next( navigator.onLine );
          sub.complete();
        })
      )
      .subscribe( isOnLine => {
        this.isOffline = !isOnLine;
      });
  }

  ngOnDestroy (): void {
    this.onLineSup.unsubscribe();
  }

  onCloseClick ( ): void {
    this.dialogRef.close();
  }

  get isOffline () {
    return this.isOffline$.getValue();
  }

  @Input()
  set isOffline ( value ) {
    this.isOffline$.next( value );
  }
}

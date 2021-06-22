import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* tslint:disable component-selector  */
@Component({
  selector: 'ClassManager',
  template: `
    <div class="loading" *ngIf="!classes">
      <span>Chargement...</span>
      <mat-progress-bar mode="indeterminate" color="#ffd740"></mat-progress-bar>
    </div>
    <div class="container" *ngIf="classes">
      <h1 mat-dialog-title>Selectionner une classe</h1>
      <div class="wrapper">
        <mat-card
          *ngFor="let clazz of classes | keyvalue"
          (click)="selectClassHandler(clazz.key)">
            <h5 class="title">{{ clazz.key }}</h5>
            <mat-card-content>
              <p>
                Class info/Visu...
              </p>
            </mat-card-content>
        </mat-card>
      </div>
    </div>

  `,
  styles: [ `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .loading {
      width: 100%;
      height: 100%;
      display: flex;
      align-content: center;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
    }
    .container {
      width: 100%;
      height:70%;
      display: flex;
      align-items: center;
      align-content: center;
      flex-direction: column;
    }
    .container > .title {
      margin: 12px;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
    }
    .wrapper mat-card {
      width: 150px;
      height: 100px;
      margin-left: 12px;
      margin-top: 12px;
    }
    mat-card:hover {
      cursor: pointer;
      transform: scale(1.1);
      transition: transform 1s ease;
    }
  ` ],
})
export class ClassManagerComponent implements OnInit {
  @Input() classes;
  @Input() selectClassHandler: Function;

  constructor () { }

  ngOnInit (): void {

  }

}

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="container">
      <h1 class="big-title">Oups !</h1>
      <p>Afin d’accèder au tableau de bord, merci de passer par le portail de suivi.</p>
      <div class="links">
        <button mat-button (click)="onSignOut()">Portail de suivi</button>
      </div>
    </div>
  `,
  styles: [ `
    .container {
      width: 100%;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .big-title {
      font-size: 120px;
      font-weight: 700;
      color: #ccc;
    }
    ` ],
})
export class UnauthorizedComponent {

  @Output() signOutHandler = new EventEmitter();

  constructor () { }

  onSignOut () {
    this.signOutHandler.emit();
  }
}

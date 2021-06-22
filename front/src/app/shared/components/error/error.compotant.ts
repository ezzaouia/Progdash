import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  template: `
    <div class="container">
      <h1 class="big-title">Oups !</h1>
      <p>Une erreur est survenue</p>
      <p>Nous travaillons pour que cela soit corrigé dès que possible</p>
      <div class="links">
        <button mat-button (click)="onNavigateToHome()">Page d'accueil</button>
        <button mat-button (click)="onNavigateToSuiviStats()">Portail de suivi</button>
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
export class ErrorComponent implements OnInit {

  @Output() navigateToHomeHandler = new EventEmitter();
  @Output() navigateToSuiviStatsHandler = new EventEmitter();

  constructor () { }

  ngOnInit (): void {}

  onNavigateToHome () {
    this.navigateToHomeHandler.emit();
  }

  onNavigateToSuiviStats () {
    this.navigateToSuiviStatsHandler.emit();
  }
}

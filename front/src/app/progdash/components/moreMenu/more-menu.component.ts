import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

/* tslint:disable component-selector  */
@Component({
  selector: 'MoreMenu',
  template: `
    <button mat-menu-item (click)="signOutHandler.emit()">
      <mat-icon>power_settings_new</mat-icon>
      Déconnexion
    </button>
    <button mat-menu-item (click)="navigateToSuiviStatsHandler.emit()">
      <mat-icon>arrow_back</mat-icon>
      Retour au portail
    </button>
  `,
  styles: [ `
    :host {
    }
  ` ],
})
export class MoreMenuComponent implements OnInit {

  @Output() signOutHandler = new EventEmitter();
  @Output() navigateToSuiviStatsHandler = new EventEmitter();

  constructor () { }

  ngOnInit (): void { }

}

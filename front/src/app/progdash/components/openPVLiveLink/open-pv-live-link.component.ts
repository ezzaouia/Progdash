import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'OpenPVLiveLink',
  template: `
    <div class="container">
      <div class="header">
        <span class="fill"></span>
        <button
          class="fab-button mat-32"
          mat-stroked-button
          (click)="onCloseClick( $event )">
            <mat-icon aria-label="menu">close</mat-icon>
        </button>
      </div>
      <div class="sync" *ngIf="!isGenerateLinkSuccess">
        Génération du lien...
        <mat-progress-bar mode="indeterminate" color="red"></mat-progress-bar>
      </div>
      <div class="info" *ngIf="isGenerateLinkSuccess">
        <p>Merci de cliquer sur le lien ci-dessous pour lancer le mode présentiel </p>
      </div>
      <div class="link" *ngIf="isGenerateLinkSuccess">
        <mat-icon
          class="back-icon"
          aria-label="open_in_new">
            open_in_new
        </mat-icon>
        <span>
          <a target="_blank" href="{{link}}" (click)="onNavigate( $event )">
            Lancez le mode présentiel
          </a>
        </span>
      </div>
    </div>
  `,
  styles: [ `
    :host {
      width: 100%;
      height: 100%;
    }
    .header {
      width: 100%;
      height: 46px;
      padding: 0 24px;
      display: flex;
      align-items: center;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .info {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    .info p {
      width: 80%;
      text-align: center;
    }
    .link {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
    }
    .sync {
      width: 100%;
      display: flex;
      align-content: center;
      flex-direction: column;
      justify-content: center;
      z-index: 1000;
    }

  ` ],
})
export class OpenPVLiveLinkComponent implements OnInit {

  @Input() link = '';
  @Input() isGenerateLinkSuccess = false;
  @Input() selectedRules = [];
  @Output() launchPVLiveHandler = new EventEmitter();
  @Output() cancelPVLiveHandler = new EventEmitter();

  constructor ( public dialogRef: MatDialogRef<OpenPVLiveLinkComponent> ) {}

  ngOnInit (): void { }

  onNavigate ( _ ) {
    this.launchPVLiveHandler.emit( this.selectedRules );
    this.dialogRef.close();
  }

  onCloseClick ( $event ): void {
    this.cancelPVLiveHandler.emit( $event );
    this.dialogRef.close();
  }
}

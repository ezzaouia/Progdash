import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snack-notify',
  template: `<p class="{{ htmClass }}">{{ message }}</p> `,
  styles: [ `
    .error {
      color: #ff3c2f;
    }
    .info {
      color: rgba(255,255,255,.7);
    }
    p {
      margin: 0;
    }
  ` ],
})
export class SnackNotifyComponent implements OnInit {

  public message: string;
  public htmClass: string;

  constructor ( @Inject( MAT_SNACK_BAR_DATA ) public data: any ) {
    this.message = data.message;
    this.htmClass = data.htmClass;
  }

  ngOnInit (): void {}
}

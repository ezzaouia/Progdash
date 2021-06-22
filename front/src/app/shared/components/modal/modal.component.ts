import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* tslint:disable component-selector  */
/* tslint:disable component-class-suffix  */
@Component({
  selector: 'Modal',
  template: `
    <ndc-dynamic
      [ndcDynamicComponent]="data.component"
      [ndcDynamicInputs]="data">
    </ndc-dynamic>
  `,
  styles: [ `` ],
})
export class Modal implements OnInit {


  constructor (
    public dialogRef: MatDialogRef<Modal>,
    @Inject( MAT_DIALOG_DATA ) public data: any
    ) { }

  ngOnInit (): void { }

}

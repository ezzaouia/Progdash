import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { size, map, mapValues, get } from 'lodash';
import { max } from 'd3';

import { DummyData, dummyData } from './utils';


/* tslint:disable component-selector  */
@Component({
  selector: 'TableViewPage',
  template: `
    <TableViewManager
      [tableMode]="'normal'"
      [data]="data"
      [columns]="columns"
      [options]="options"
      [colDefaultWidth]="colDefaultWidth"
      [colDefaultHeight]="colDefaultHeight">
    </TableViewManager>
  `,
  styles: [ `
      :host {
        height: 100vh;
        display: block;
      }
  ` ],
})
export class TableViewPageComponent {

  @Output() options = { toolbar: true, header: true };
  colDefaultWidth = 100;
  colDefaultHeight = 30;

  columns = {
    id: { name: 'Id', histo: '', encoding: 'STRING', width: 40, topBottom: 0 },
    nbr: { name: 'Nbr', histo: 'ordinal', encoding: 'BAR' },
    nbr2: { name: 'Nbr2', histo: 'ordinal', encoding: 'BAR' },
    nbr3: { name: 'Nbr3', histo: 'ordinal', encoding: 'BAR' },
    nbr4: { name: 'Nbr4', histo: 'ordinal', encoding: 'DOT' },
    stack: { name: 'Stack', histo: '', encoding: 'STACK',
    keys: [ 'nbr', 'Nbr2', 'nbr3' ], hint: 'hint' },
    cat: { name: 'Cat', histo: 'categorical', encoding: 'CAT' },
    // cat2: { name: 'Cat2', histo: 'categorical', encoding: 'CAT' },
    // cat3: { name: 'Cat3', histo: 'categorical', encoding: 'CAT' },
    cat4: { name: 'Cat4', histo: 'categorical', encoding: 'MCAT' },
    line: { name: 'Line', histo: '', encoding: 'LINE', xkey: 'x', ykey: 'y' },
  };


  data = dummyData( 40 );
  // dataStream = new BehaviorSubject<DummyData[]>( data );

}

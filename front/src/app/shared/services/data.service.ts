import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { csv } from 'd3';

@Injectable()
export class DataService {

  rangeFilter$ = new BehaviorSubject([ 0, Infinity ]);
  rangeFilterByKey$ = new BehaviorSubject({
    currentLevel: [ 0, 1000 ],
    timeSpent: [ 0, 999999999 ],
    initialEvalCat: '',
    groupName: '',
  });

  constructor () { }

  changeRangeFilter ( range: number[]) {
    this.rangeFilter$.next( range );
  }

  changeRangeFilterByKey ( range ) {
    this.rangeFilterByKey$.next({ ...this.rangeFilterByKey$.getValue(), ...range });
  }

  loadCSV$ ( string, typeFn? ) {
    return from(
      csv(
        string,
        typeFn
      ));
  }

  loadCSV ( string, typeFn? ) {
    return csv(
      string,
      typeFn
    );
  }

}

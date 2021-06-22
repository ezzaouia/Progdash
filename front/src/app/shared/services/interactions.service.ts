import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Highlight {
  id: string;
}

@Injectable()
export class InteractionsService {

  rangeFilter$ = new BehaviorSubject<{}>({ });
  highlight$ = new BehaviorSubject<Highlight>({ id: '' });
  tableViewRenderedData$ = new BehaviorSubject<any[]>([ ]);


  get highlight (): Highlight {
    return this.highlight$.getValue();
  }

  set highlight ( value: Highlight ) {
    this.highlight$.next( value );
  }

  get rangeFilter () {
    return this.rangeFilter$.getValue();
  }

  set rangeFilter ( value ) {
    this.rangeFilter$.next({ ...this.rangeFilter$.getValue(), ...value });
  }
}

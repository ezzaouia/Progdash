import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as fromStore from '../store';


@Injectable()
export class UserService {
    private userInfo$: Observable<{userId: number, areaId: number}>;

    constructor ( private store: Store<fromStore.State> ) {
        this.userInfo$ = this.store.pipe( select( fromStore.userInfo ));
    }

    public getUserId (): Number {
        let val: number = null;
        this.userInfo$.pipe(
            take( 1 )
        ).subscribe(
            v => {val = v.userId; }
        );
        return val;
    }

    public getAreaId (): Number {
        let val: number = null;
        this.userInfo$.pipe(
            take( 1 )
        ).subscribe(
            v => {val = v.areaId; }
        );
        return val;
    }

}

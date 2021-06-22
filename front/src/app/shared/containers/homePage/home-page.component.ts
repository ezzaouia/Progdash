import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";
import { Store } from "@ngrx/store";

import * as fromStore from "../../../progdash/store";
import { Modal, ErrorLandingComponent } from "../../components";

@Component({
  selector: "app-home-page",
  template: `
    <app-home-view>
      <app-container></app-container>
    </app-home-view>
  `,
  styles: [``]
})
export class HomePageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<fromStore.State>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // const user: string = this.route.snapshot.queryParamMap.get( 'user' );
    // const area: string = this.route.snapshot.queryParamMap.get( 'area' );
    // const userId: number = parseInt( user, 10 );
    // const areaId: number = parseInt( area, 10 );
    // if ( !isNaN( userId ) && !isNaN( areaId )) {
    //   this.store.dispatch(
    //     new fromStore.LoadUserInfo({
    //       userId: userId as number,
    //       areaId: areaId as number,
    //     })
    //   );
    // } else {
    //   this.errorLandingHandler();
    // }
    this.store.dispatch(
      new fromStore.LoadUserInfo({
        userId: 2323323,
        areaId: 3223232
      })
    );
  }

  errorLandingHandler() {
    // workaround https://github.com/angular/material2/issues/5268
    setTimeout(() => {
      this.dialog.open(Modal, {
        width: "50vw",
        height: "50vh",
        disableClose: true,
        data: {
          component: ErrorLandingComponent
        }
      });
    }, 0);
  }
}

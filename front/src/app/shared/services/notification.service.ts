import { Injectable, Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { v4 as uuid } from "uuid";
import { DeviceDetectorService } from "ngx-device-detector";
import { MatDialog } from "@angular/material";

import { environment } from "../../../environments/environment";
import { Modal, NoInternetComponent } from "../components";

@Injectable()
export class NotificationService {
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
      // 'Authorization': 'my-auth-token'
    })
  };
  private sessionId; // This is not the same session as for trace.

  constructor(
    private injector: Injector,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.sessionId = uuid();
  }

  notifyOffline() {
    // workaround https://github.com/angular/material2/issues/5268
    setTimeout(() => {
      this.dialog.open(Modal, {
        width: "50vw",
        height: "50vh",
        disableClose: true,
        data: {
          component: NoInternetComponent,
          isOffline: true
        }
      });
    }, 0);
  }

  error(message, actionType?) {
    // the goal here is to only track the error
    this.createAudit(message, actionType);
  }

  public createAudit(error, actionType?) {
    const payload = { error: error, context: this.getContextInfo(actionType) };
    console.log("[createAudit]", payload);
    return this.http
      .post<any>(
        environment.API_URL + "/audit/error",
        payload,
        this.httpOptions
      )
      .subscribe();
  }

  /**
   * Add needed context info to a trace OR error
   */
  private getContextInfo(actionType?) {
    const device = this.deviceService.getDeviceInfo();
    const teacherId = this.route.snapshot.queryParamMap.get("user");
    const areaId = this.route.snapshot.queryParamMap.get("area");
    const sessionId = this.sessionId;
    const clientTimestamp = new Date().getTime();
    // maybe not as much important for now as we have only one route
    const url = window.location.href;
    return {
      teacherId,
      areaId,
      sessionId,
      clientTimestamp,
      url,
      device,
      actionType
    };
  }
}

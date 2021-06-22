import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuid } from 'uuid';

import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TraceService {
  private sessionId: String;

  constructor ( private userSevice: UserService, private newHttp: HttpClient ) {
    this.sessionId = uuid();
  }

  public createTrace ( trace: { type: string; payload?: any }) {

    const data = {
      actionType: trace.type,
      payload: JSON.stringify( trace.payload ),
      teacherId: this.userSevice.getUserId(),
      sessionId: this.sessionId,
      areaId: this.userSevice.getAreaId(),
      clientTimestamp: new Date().getTime(),
    };
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([ JSON.stringify( data ) ], {
        type: 'application/json',
      })
    );
    if ( trace.payload && trace.payload.blob ) {
      formData.append(
        'file',
        new Blob([ ( trace as any ).payload.blob ], {
          type: 'application/pdf',
        })
      );
    }

    return this.newHttp
      .post<any>( environment.API_URL + '/teacher/trace', formData )
      .subscribe(() => {}); // mandatory to trigger post
  }

}

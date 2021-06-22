import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { join, map as mapl } from 'lodash';

@Injectable()
export class TeacherService {
  constructor ( private http: HttpClient ) {}

  public getLink ({ lessons, userInfo }) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const lessonsMap = mapl( lessons, l => `chapters=${l}` );
    const url = join( lessonsMap, '&' );

    const pathApi = environment.SUIVI_STATS_URL +
        `/services-pjv/rest/manager/area/${userInfo.areaId}/teacher/module/url`;

    return this.http
      .post<{ status: String; data: String }>( pathApi, url, httpOptions )
      .pipe(
        map( response => {
            if ( response.status === 'error' ) {
            throw new Error( 'impossible d\'obtenir le mode présentiel' );
            }
            return response.data;
        }));
  }
}


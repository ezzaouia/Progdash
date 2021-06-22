import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class ProgdashDataService {
  API_URL = environment.API_URL;

  constructor ( private http: HttpClient ) {}

  loadGroupsData$ ({ areaId }) {
    return this.http.get( `${this.API_URL}/statistics/area/${areaId}/groups` );
  }

  loadGroupData$ ({ groupId, areaId }) {
    return this.http.get( `${this.API_URL}/statistics/area/${areaId}?groupId=${groupId}` );
  }

}

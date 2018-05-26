import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Session} from '../models/session';

@Injectable()
export class SessionService {
  private _url = '/api/sessions.json';
  constructor(private _http: HttpClient) {}
  getSessions(): Observable<Session[]> {
    return this._http.get<Session[]>(this._url);
  }
}

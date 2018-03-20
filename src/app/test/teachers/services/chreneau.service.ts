import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Chrenau} from '../models/chrenau';

@Injectable()
export class ChreneauService {
  private _url = 'http://localhost:8181/api/crenaux/distinct';
  constructor(private _http: HttpClient) {}
  getChreneaux(): Observable<Chrenau[]> {
     return this._http.get<Chrenau[]>(this._url);
  }
}

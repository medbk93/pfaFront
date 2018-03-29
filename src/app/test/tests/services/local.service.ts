import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Locale} from '../models/locale';
@Injectable()
export class LocalService {
  private _localUrl = 'http://localhost:8181/api/locaux';
  constructor(private _http: HttpClient) {}
  getAllLocaux(): Observable<Locale[]> {
    return this._http.get<Locale[]>(this._localUrl);
  }
}

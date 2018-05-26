import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Level} from '../models/level';

@Injectable()
export class LevelService {

  private _baseClass = 'http://localhost:8181/api/niveaux';

  constructor(private _http: HttpClient) { }
  getAllLevel(): Observable<Level[]> {
    return this._http.get<Level[]>(this._baseClass ).map(result => {
      return result;
    });
  }

}

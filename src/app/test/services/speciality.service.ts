import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Speciality} from '../models/speciality';

@Injectable()
export class SpecialityService {

  private _baseClass = 'http://localhost:8181/api/specialities';

  constructor(private _http: HttpClient) { }
  getAll(): Observable<Speciality[]> {
    return this._http.get<Speciality[]>(this._baseClass).map(result => {
      return result;
    });
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Department} from '../models/department';

@Injectable()
export class DepartmentService {

  private _baseClass = 'http://localhost:8181/api/departments';

  constructor(private _http: HttpClient) { }
  getAll(): Observable<Department[]> {
    return this._http.get<Department[]>(this._baseClass).map(result => {
      return result;
    });
  }

}

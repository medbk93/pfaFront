import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from '../models/subject';

@Injectable()
export class SubjectService {

  private _baseSubject = 'http://localhost:8181/api/matieres';
  constructor(private _http: HttpClient) { }
  getAllSubject(): Observable<Subject[]> {
    return this._http.get<Subject[]>(this._baseSubject + '/all').map(result => {
      return result;
    });
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Test} from '../models/test';

@Injectable()
export class TestService {
  private _testsUrl = 'http://localhost:8181/api/epreuves';
  constructor(private _http: HttpClient) {}
  getAllTests(): Observable<Test[]> {
    return this._http.get<Test[]>(this._testsUrl + '/all');
  }
  updateTests(tests: Test[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.put<Test[]>(this._testsUrl + '/update', JSON.stringify(tests), httpOptions);
  }
}

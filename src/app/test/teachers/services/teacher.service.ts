import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Teacher} from '../models/teacher';
import 'rxjs/add/operator/map';

@Injectable()
export class TeacherService {

  private _teacherUrl = 'http://localhost:8181/api/surveillants';

  constructor(private _http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(this._teacherUrl).map(response => {
      return response;
    });
  }
  getTreatedTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(this._teacherUrl + '/treated').map(response => {
      return response;
    });
  }
  getNoTreatedTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(this._teacherUrl + '/noTreated').map(response => {
      return response;
    });
  }

  getPermanentTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(this._teacherUrl + '/permanents').map(response => {
      return response;
    });
  }

  getVacataireTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(this._teacherUrl + '/vacataire').map(response => {
      return response;
    });
  }

  getTeacher(id: number): Observable<Teacher> {
    return this.getTeachers()
      .map((teachers: Teacher[]) => teachers.find(t => t.id === id));
  }

  saveTeacherAvailability(teacher: Teacher, ids: number[]): Observable<Teacher> {
    const data = {surveillant: teacher, ids: ids};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.post<Teacher>(this._teacherUrl + '/availability/new', JSON.stringify(data), httpOptions);
  }


}

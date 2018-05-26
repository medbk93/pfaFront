import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {Classe} from '../tests/models/classe';
import {catchError, tap} from 'rxjs/operators';
import {LevelService} from "./level.service";
import {LevelSpeciality} from "../models/level-Speciality";

@Injectable()
export class ClasseService {

  private _baseClass = 'http://localhost:8181/api/classes';
  private classes: Classe[];

  constructor(private _http: HttpClient) { }
  getAllClass(): Observable<Classe[]> {
    if (this.classes) {
      return Observable.of(this.classes);
    }
    return this._http.get<Classe[]>(this._baseClass + '/all')
      .pipe(
        tap(data => console.log(data)),
        tap(data => this.classes = data),
        catchError(this.handleError)
      );
  }
  getLevelSpecialityId(specId: number, levelId: number): Observable<LevelSpeciality> {
    return this._http.get<LevelSpeciality>(`${this._baseClass}/speciality/${specId}/niveau/${levelId}`).map(result => {
      return result;
    });
  }

  saveClasse(classe: Classe): Observable<Classe> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (classe.id === 0) {
      return this.createClasse(classe, headers);
    }
    return this.updateClasse(classe, headers);
  }

  deleteClasse(id: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this._baseClass}/${id}`;
    return this._http.delete(url, { headers: headers})
      .pipe(
        tap(data => console.log('deleteClasse: ' + JSON.stringify(data))),
        tap(data => {
          const foundIndex = this.classes.findIndex(item => item.id === id);
          if (foundIndex > -1) {
            this.classes.splice(foundIndex, 1);
          }
        }),
        catchError(this.handleError)
      );
  }

  private createClasse(classe: Classe, headers: HttpHeaders): Observable<Classe> {
    classe.id = null;
    return this._http.post<Classe>(this._baseClass, classe,  { headers: headers})
      .pipe(
          tap(data => console.log('createClasse: ' + JSON.stringify(data))),
          tap(data => this.classes.push(data)),
          catchError(this.handleError)
      );
  }
  private updateClasse(classe: Classe, headers: HttpHeaders): Observable<Classe> {
    const url = this._baseClass + '/update/ ' + classe.id;
    return this._http.put<Classe>(url, classe,  { headers: headers})
      .pipe(
        tap(data => console.log('updateClasse: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    throw new Error(
      'Something bad happened; please try again later.');
  }
}

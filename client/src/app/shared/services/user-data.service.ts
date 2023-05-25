import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, dematerialize, map, materialize, retry, throwError } from 'rxjs';
import { IFaculty } from '../models/Faculty';
import { ISchool } from '../models/School';
import { User } from "../models/User";
import { baseUrl, defaultResponseDelay, defaultRetryRate } from './register.service';
import { ErrorMessage } from './ErrorsEnum';
import { IInterest } from '../models/Interest';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>(baseUrl + 'api/register-data/faculties')
      .pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
        retry(defaultRetryRate),
      );
  }

  getSchools(): Observable<ISchool[]> {
    return this.http.get<ISchool[]>(baseUrl + 'api/register-data/schools')
      .pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
        retry(defaultRetryRate),
      );
  }

  getInterests(): Observable<IInterest[]> {
    return this.http.get<IInterest[]>(baseUrl + 'api/register-data/interests')
      .pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
        retry(defaultRetryRate),
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + "users").pipe(
      retry(2)
    )
  }

  getUsersWithParameters(schoolId: number, facultyId: number, course: number) {
    let parameter = new HttpParams()
    if (schoolId) {
      parameter = parameter.set('schoolId', schoolId)
    }
    if (facultyId) {
      parameter = parameter.set('studyProgramId', facultyId)
    }
    if (course) {
      parameter = parameter.set('course', course)
    }
    return this.http.get<User[]>(baseUrl + 'users', {params: parameter}).pipe(
      retry(2)
    )
  }

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    switch (error.status) {
      case 0:
        errorMessage = ErrorMessage.NETWORK_ERROR;
        break;

      case 401:
        errorMessage = ErrorMessage.UNAUTHORIZED;
        break;

      case 500:
        errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
        break;

      default:
        errorMessage = error.message;
        break;
    }

    return throwError(() => new Error(errorMessage)).pipe(
      materialize(),
      delay(2000),
      dematerialize()
    );
  }
}

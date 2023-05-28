import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, dematerialize, materialize, retry, throwError } from 'rxjs';
import { IFaculty } from '../models/Faculty';
import { ISchool } from '../models/School';
import { User } from "../models/User";
import { defaultResponseDelay, defaultRetryRate } from './servicesConfig';
import { ErrorMessage } from './ErrorsEnum';
import { IInterest } from '../models/Interest';
import { EducationLevel } from '../Enums/EducationLevel';
import { StatusUser } from '../Enums/StatusUser';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>('/api/register-data/faculties')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getFacultyById(id: number): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>(`/api/register-data/faculties?id=${id}`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getSchools(): Observable<ISchool[]> {
    return this.http.get<ISchool[]>('/api/register-data/schools')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getSchoolById(id: number): Observable<ISchool[]> {
    return this.http.get<ISchool[]>(`/api/register-data/schools?id=${id}`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getInterests(): Observable<IInterest[]> {
    return this.http.get<IInterest[]>('/api/register-data/interests')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getInterestById(id: number): Observable<IInterest[]> {
    return this.http.get<IInterest[]>(`/api/register-data/interests?id=${id}`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>("/api/users")
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getUserAvatar(id: number): Observable<string> {
    return this.http.get<string>(`/api/avatar/${id}`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  userStatusFromId(id: number): string { return StatusUser[id]; }

  educationLevelFromId(id: number): string { return EducationLevel[id]; }

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
    return this.http.get<User[]>('users', {params: parameter}).pipe(
      retry(2)
    )
  }

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    switch (error.status) {
      case 0:
        errorMessage = ErrorMessage.NETWORK_ERROR;
        break;

      case 204:
        errorMessage = ErrorMessage.NO_CONTENT;
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

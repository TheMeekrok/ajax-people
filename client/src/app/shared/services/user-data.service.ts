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

  getUsers(items: number, page: number, usersFilter: IUser): Observable<IUser[]> {
    let params = new HttpParams;

    params = params.set('items', items);
    params = params.set('page', page);

    if (usersFilter.age) { 
      params = params.set('age', usersFilter.age); 
    }
    if (usersFilter.statusUserId) { 
      params = params.set('statusUserId', usersFilter.statusUserId);
    }
    if (usersFilter.educationLevelId) {
      params = params.set('educationLevelId', usersFilter.educationLevelId);
    }
    if (usersFilter.admissionYear) {
      params = params.set('admissionYear', usersFilter.admissionYear);
    }
    if (usersFilter.schoolId) { 
      params = params.set('schoolId', usersFilter.schoolId);
    }
    if (usersFilter.studyProgramId) { 
      params = params.set('studyProgramId', usersFilter.studyProgramId);
    }
    if (usersFilter.interestIds) { 
      params = params.set('interestsIds', usersFilter.interestIds);
    }

    return this.http.get<IUser[]>('/api/users', { params })
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getUserAvatar(id: number): Observable<string> {
    return this.http.get<string>(`/api/avatar/${id}`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>('/api/users/get-id')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  userStatusFromId(id: number): string { return StatusUser[id]; }

  educationLevelFromId(id: number): string { return EducationLevel[id]; }

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

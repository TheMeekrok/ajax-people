import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import { defaultResponseDelay, defaultRetryRate } from './servicesConfig';
import { IResponseToken } from '../models/Response';
import { delay, dematerialize, materialize, throwError, Observable, catchError, retry } from 'rxjs';
import { ErrorMessage } from './ErrorsEnum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authUser(userData: IUser): Observable<IResponseToken> {
    return this.http.post<IResponseToken>('/sign-in', userData, { withCredentials: true })
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    switch (error.status) {
      case 0:
        errorMessage = ErrorMessage.NETWORK_ERROR;
        break;

      case 400:
        errorMessage = ErrorMessage.INVALID_DATA;
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
      delay(defaultResponseDelay),
      dematerialize()
    );
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import { Observable, catchError, delay, dematerialize, materialize, retry, throwError } from 'rxjs';
import { IResponseId } from '../models/Response';
import { ErrorMessage } from './ErrorsEnum';

export const baseUrl = 'http://localhost:8080/'
export const defaultResponseDelay = 2000;
export const defaultRetryRate = 0;

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registerUser(userData: IUser): Observable<IResponseId> {
    return this.http
      .post<IResponseId>(baseUrl + 'sign-up', userData)
      .pipe(
        delay(defaultResponseDelay), 
        catchError(this._handleError)
      );
  }

  verifyCode(code: string, userId: number): Observable<string> {
    return this.http
      .put<string>(`/activation/check/${userId}`, { code: code })
      .pipe(
        delay(defaultResponseDelay), 
        catchError(this._handleError)
      );
  }

  updateUserData(userData: IUser, userId: number) {
    return this.http
      .put(`/api/users/${userId}`, userData)
      .pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
        retry(defaultRetryRate),
      );
  }

  /**
   * Обрабочтик ошибок, возникающих при регистрации нового пользователя
   */
  private _handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    switch (error.status) {
      case 0:
        errorMessage = ErrorMessage.NETWORK_ERROR;
        break;

      case 400:
        errorMessage = ErrorMessage.INVALID_CODE;
        break;

      case 500:
        errorMessage = ErrorMessage.CHECK_CORRECTNESS;
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

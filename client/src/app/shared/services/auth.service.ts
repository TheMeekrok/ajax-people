import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import { defaultResponseDelay, defaultRetryRate } from './servicesConfig';
import { IResponseToken } from '../models/Response';
import { delay, dematerialize, materialize, throwError, Observable, catchError, retry, tap } from 'rxjs';
import { ErrorMessage } from '../enums/Errors';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  authUser(userData: IUser): Observable<IResponseToken> {
    return this.http.post<IResponseToken>('/sign-in', userData)
      .pipe(
        tap((response: IResponseToken) => this.storageService.saveUserToken(response.token))
      );
  }

  exitUser() {
    return this.http.post('/sign-out', null)
      .pipe(
        tap(() => this.storageService.removeUserToken())
      )
  }
}

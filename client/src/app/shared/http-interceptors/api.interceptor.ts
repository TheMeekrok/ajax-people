import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, delay, dematerialize, materialize, retry, throwError } from 'rxjs';
import { ErrorMessage } from '../enums/Errors';

export const defaultResponseDelay = 100;
export const defaultRetryRate = 1;

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
        .pipe(delay(defaultResponseDelay), catchError(this.handleError), retry(defaultRetryRate))
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    switch (error.status) {
      case 0:
        errorMessage = ErrorMessage.NETWORK_ERROR;
        break;

      case 204:
        errorMessage = ErrorMessage.NO_CONTENT;
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

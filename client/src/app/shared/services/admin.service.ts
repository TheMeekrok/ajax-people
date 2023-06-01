import { Injectable } from '@angular/core';
import { catchError, delay, dematerialize, materialize, Observable, retry, throwError } from "rxjs";
import { Tag } from "../models/Tag";
import { IInterest } from "../models/Interest";
import { defaultResponseDelay, defaultRetryRate } from "./servicesConfig";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { ErrorMessage } from "./ErrorsEnum";
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  /**
   * Метод для получения всех тэгов
   */
  getTags(): Observable<Tag[]> {
    return this.http.get<IInterest[]>('/api/tags')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  deleteTag(id: number) {
    console.log(id);
    return this.http.delete<string>('api-private/tags/' + id)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  createTag(tag: {title: string}) {
    console.log(tag);
    return this.http.post<string>(`api-private/tags/`, tag)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }
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

    console.log(errorMessage)
    return throwError(() => new Error(errorMessage)).pipe(
      materialize(),
      delay(2000),
      dematerialize()
    );
  }

}

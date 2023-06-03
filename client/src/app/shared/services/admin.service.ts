import { Injectable } from '@angular/core';
import { catchError, delay, dematerialize, materialize, Observable, retry, throwError } from "rxjs";
import { Tag } from "../models/Tag";
import { IInterest } from "../models/Interest";
import { defaultResponseDelay, defaultRetryRate } from "./servicesConfig";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorMessage } from "./ErrorsEnum";
import { Post } from "../models/Post";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }


  // getAuthorizedUser() {
  //   return this.http.get<User>('api/users/get-id')
  //     .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  // }
  getTags(): Observable<Tag[]> {
    return this.http.get<IInterest[]>('api/tags')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  deleteTag(id: number) {
    return this.http.delete<string>('api-private/tags/' + id)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  createTag(tag: {title: string}) {
    console.log(tag);
    return this.http.post<string>(`api-private/tags/`, tag)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  moderatePost(id: number) {
    const body = {
      isModerated: true
    }
    return this.http.put<string>(`api-private/posts/` + id, body)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  deletePost(id: number) {
    return this.http.delete<string>(`api-private/posts/` + id)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }


  getUnmoderatedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`api-private/posts`)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('api/users')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }


  appointAnAdmin(id: number) {
    return this.http.put('api-private/users/' + id, null)
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

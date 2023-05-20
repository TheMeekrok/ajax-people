import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, delay, dematerialize, materialize, Observable, retry, throwError} from "rxjs";
import {IPost} from "../models/Post";
import {IUser} from "../models/IUser";
import {IInterest} from "../models/Interest";
import {baseUrl, defaultResponseDelay} from "./servicesConfig";
import {ErrorMessage} from "./ErrorsEnum";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getPosts() {
      return this.http.get<IPost[]>(baseUrl + "api/posts/").pipe(
      retry(2),
    )
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>( baseUrl + 'api/users/' + id)
      .pipe(
        retry(2)
      )
  }

  getInterests(): Observable<IInterest[]> {
    return this.http.get<IInterest[]>(baseUrl + 'api/register-data/interests')
      .pipe(
        retry(2)
      )
  }

  private _handleError(error: HttpErrorResponse) {
    alert()
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


  savePost(post: IPost): Observable<string> {
    const body = {
      text: post.text,
      tags: post.tags.map(i => i.id)
    }
    return this.http
      .post<string>(
        baseUrl + `api/posts/`,
        JSON.stringify(body)
      ).pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
      );
  }
}

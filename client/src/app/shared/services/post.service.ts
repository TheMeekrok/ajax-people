import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, delay, dematerialize, materialize, Observable, retry, throwError } from "rxjs";
import { IPost } from "../models/Post";
import { IUser } from "../models/IUser";
import { IInterest } from "../models/Interest";
import { defaultResponseDelay, defaultRetryRate } from "./servicesConfig";
import { ErrorMessage } from "./ErrorsEnum";
import { Tag } from "../models/Tag";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  /**
   * Метод, переводящий массив тэгов к строке типа '1,2,3'
   * @param array - массив тэгов
   */
  tagsToString(array: Tag[]): string {
    let s  = "";
    if (array && !array.length) {
      return s;
    }
    for (let i = 0; i < array.length - 1; i++) {
      s += array[i].id + ',';
    }
    s += array[array.length - 1]?.id;
    return s;
  }

  /**
   * Метод для получения количеста постов
   * @param tags - массив тэгов-фильтров
   */
  getCountPosts(tags: Tag[]) {
    let parameter = new HttpParams();
    if (tags && tags.length) {
      parameter = parameter.set('tags', this.tagsToString(tags))
    }
    return this.http.get<IPost[]>('/api/posts/', {params: parameter})
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  /**
   * Метод для получения постов с заданными фильтрами
   * @param orderBy - статус кнопки сначала новые / старые
   * @param page - интекс страница
   * @param items - количество элементов на стрнице
   * @param tags - массив тэгов-фильтров
   */
  getPosts(orderBy: number, page: number, items: number, tags: Tag[]) {
    let parameters = new HttpParams()
    parameters = parameters.set('orderBy', orderBy);
    parameters = parameters.set('page', page);
    parameters = parameters.set('items', items);
    if (tags.length) {
      parameters = parameters.set('tags', this.tagsToString(tags));
    }
    return this.http.get<IPost[]>('/api/posts/', {params: parameters})
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  /**
   * Метод для получения пользователя по его id
   * @param id - id пользователя
   */
  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>('/api/users/' + id)
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  /**
   * Метод для получения всех интересов
   */
  getInterests(): Observable<IInterest[]> {
    return this.http.get<IInterest[]>('api/register-data/interests')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  /**
   * Метод для получения всех тэгов
   */
  getTags(): Observable<Tag[]> {
    return this.http.get<IInterest[]>('/api/tags/')
      .pipe(delay(defaultResponseDelay), catchError(this._handleError), retry(defaultRetryRate));
  }

  /**
   * Обработчик ошибок
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

    console.log(errorMessage)
    return throwError(() => new Error(errorMessage)).pipe(
      materialize(),
      delay(2000),
      dematerialize()
    );
  }

  /**
   * Метод, вызываемый для сохранении поста
   * @param post - новый пост
   */
  savePost(post: IPost): Observable<string> {
    const body = {
      text: post.text,
      tags: post.tags.map(i => i.id)
    }
    return this.http
      .post<string>(
        `api/posts/`,
        JSON.stringify(body)
      ).pipe(
        delay(defaultResponseDelay),
        catchError(this._handleError),
      );
  }
}

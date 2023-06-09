import { Injectable } from '@angular/core';
import { delay, Observable, retry } from "rxjs";
import { Tag } from "../models/Tag";
import { IInterest } from "../models/Interest";
import { defaultResponseDelay, defaultRetryRate } from "./servicesConfig";
import { HttpClient } from "@angular/common/http";
import { Post } from "../models/Post";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }


  getAuthorizedUser() {
    return this.http.get<User>('api/users/get-id')
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }
  getTags(): Observable<Tag[]> {
    return this.http.get<IInterest[]>('api/tags')
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  deleteTag(id: number) {
    return this.http.delete<string>('api-private/tags/' + id)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  createTag(tag: {title: string}) {
    return this.http.post<string>(`api-private/tags/`, tag)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  createInterest(interest: {title: string}) {
    return this.http.post<string>(`api-private/interests/`, interest)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  deleteInterest(id: number) {
    return this.http.delete<string>('api-private/interests/' + id)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }
  moderatePost(id: number) {
    const body = {
      isModerated: true
    }
    return this.http.put<string>(`api-private/posts/` + id, body)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  deletePost(id: number) {
    return this.http.delete<string>(`api-private/posts/` + id)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }


  getUnmoderatedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`api-private/posts`)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }

  appointAnAdmin(id: number) {
    const body = {
      isAdmin: true
    }
    return this.http.put('api-private/users/admin/' + id, body)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }


  deleteFromAdmin(id: number) {
    const body = {
      isAdmin: false
    }
    return this.http.put('api-private/users/admin/' + id, body)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }


  banUser(id: number) {
    const body = {
      isBan: true
    }
    return this.http.put('api-private/users/ban/' + id, body)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }




  unBanUser(id: number) {
    const body = {
      isBan: false
    }
    return this.http.put('api-private/users/ban/' + id, body)
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('api-private/users/')
      .pipe(delay(defaultResponseDelay), retry(defaultRetryRate));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/IUser';
import { Observable } from 'rxjs';
import { IResponseId } from '../models/Response';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registerUser(userData: IUser): Observable<IResponseId> {
    return this.http.post<IResponseId>('/sign-up', userData);
  }

  verifyCode(code: string, userId: number): Observable<string> {
    return this.http.put<string>(`/activation/check/${userId}`, { code });
  }

  updateUserData(userData: IUser, userId: number) {
    return this.http.put(`/api/users/${userId}`, userData);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFaculty } from '../models/Faculty';
import { ISchool } from '../models/School';
import { IInterest } from '../models/Interest';
import { EducationLevel } from '../enums/EducationLevel';
import { StatusUser } from '../enums/StatusUser';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>('/api/register-data/faculties');
  }

  getFacultyById(id: number): Observable<IFaculty[]> {
    return this.http.get<IFaculty[]>(`/api/register-data/faculties?id=${id}`);
  }

  getSchools(): Observable<ISchool[]> {
    return this.http.get<ISchool[]>('/api/register-data/schools');
  }

  getSchoolById(id: number): Observable<ISchool[]> {
    return this.http.get<ISchool[]>(`/api/register-data/schools?id=${id}`);
  }

  getInterests(): Observable<IInterest[]> {
    return this.http.get<IInterest[]>('/api/register-data/interests');
  }

  getInterestById(id: number): Observable<IInterest[]> {
    return this.http.get<IInterest[]>(`/api/register-data/interests?id=${id}`);
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`/api/users/${id}`);
  }

  getUsers(items: number, page: number, usersFilter: IUser): Observable<IUser[]> {
    let params = new HttpParams;

    params = params.set('items', items);
    params = params.set('page', page);

    if (usersFilter.age) { 
      params = params.set('age', usersFilter.age); 
    }
    if (usersFilter.statusUserId) { 
      params = params.set('statusUserId', usersFilter.statusUserId);
    }
    if (usersFilter.educationLevelId) {
      params = params.set('educationLevelId', usersFilter.educationLevelId);
    }
    if (usersFilter.admissionYear) {
      params = params.set('admissionYear', usersFilter.admissionYear);
    }
    if (usersFilter.schoolId) { 
      params = params.set('schoolId', usersFilter.schoolId);
    }
    if (usersFilter.studyProgramId) { 
      params = params.set('studyProgramId', usersFilter.studyProgramId);
    }
    if (usersFilter.interestIds) { 
      params = params.set('interestsIds', usersFilter.interestIds);
    }

    return this.http.get<IUser[]>('/api/users', { params });
  }

  getUserAvatar(id: number): Observable<string> {
    return this.http.get<string>(`/api/avatar/${id}`);
  }

  getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>('/api/users/get-id');
  }

  uploadUserAvatar(avatar: FormData) {
    return this.http.post('/api/avatar/upload', avatar);
  }

  getRateForUser(userId: number): Observable<number> {
    return this.http.get<number>(`/api/users/rating/${userId}`);
  }

  setRateForUser(userId: number, value: number) {
    return this.http.put(`/api/users/rating/${userId}`, { value });
  }

  userStatusFromId(id: number): string { 
    return StatusUser[id]; 
  }

  educationLevelFromId(id: number): string { 
    return EducationLevel[id]; 
  }
}

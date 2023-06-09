import { Injectable } from '@angular/core';

const jwtTokenKey = 'jwtToken';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  saveUserToken(jwtToken: string): void {
    window.localStorage.setItem(jwtTokenKey, jwtToken);
  }

  getUserToken(): string | null {
    return window.localStorage.getItem(jwtTokenKey);
  }

  removeUserToken(): void {
    window.localStorage.removeItem(jwtTokenKey);
  }
}

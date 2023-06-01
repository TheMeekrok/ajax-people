import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  scrollToTop(): void {
    window.scroll({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }
}

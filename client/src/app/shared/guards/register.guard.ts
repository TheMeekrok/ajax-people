import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterComponent } from 'src/app/modules/register/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: RegisterComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      console.log(component.canDeactivate, component.registerState);

      if (component.canDeactivate) {
        return window.confirm('Вы действительно хотите прервать регистрацию?');
      }

      return true;
  }
}

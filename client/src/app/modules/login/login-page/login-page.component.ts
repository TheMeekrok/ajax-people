import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ILoginUser} from "../../../shared/models/LoginUser";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.maxLength(32),
        Validators.minLength(8),
        Validators.pattern('[a-zA-Z1-9()_-]*'),
        Validators.required,
      ]),
    });
  }

  emailErrorString: string = '';
  getEmailErrorString() {
    let error = this.loginForm.controls['email'].errors;
    if (!error) return;

    let errorString: string = '';

    if (error['email']) errorString = 'Неверный формат почты';
    else if (error['required']) errorString = 'Обязательное поле';

    this.emailErrorString = errorString;
  }

  passwordErrorString: string = '';
  getPasswordErrorString() {
    let error = this.loginForm.controls['password'].errors;
    if (!error) return;

    let errorString: string = '';

    if (error['required']) errorString = 'Обязательное поле';
    else if (error['maxlength']) errorString = 'Максимальная длина 32 символа';
    else if (error['minlength']) errorString = 'Минимальная длина 8 символов';
    else if (error['pattern']) errorString = 'Латинские буквы, цифры и символы';

    this.passwordErrorString = errorString;
  }

  onSubmit() {
    if (this.loginForm.status === 'VALID') {
      let user: ILoginUser = {
        email: String(this.loginForm.value['email']),
        password: String(this.loginForm.value['password']),
      };
      console.log(user);
      return;
    }

    this.getEmailErrorString();
    this.getPasswordErrorString();
  }
}

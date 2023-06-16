import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILoginUser } from "../../../shared/models/IUser";
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  form: FormGroup;
  isLoading: boolean;
  formErrorMessage: string;

  ngOnInit(): void {
    if (this.storageService.getUserToken()) {
      this.router.navigate(['/people']);
    }

    this.initForm();
  }

  onSubmit() {
    this.tryLogin();
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.pattern('^[a-zA-Z]+[.][a-zA-Z]+@[a-zA-z]*[.]*dvfu.ru$'),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.maxLength(32),
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  get email() {
    return this.form.controls['email'];
  }
  get emailErrorMessage(): string {
    const errors = this.email?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = 'Обязательное поле';
    else if (errors?.['pattern']) errorMessage = 'Не является почтой ДВФУ';

    return errorMessage;
  }

  get password() {
    return this.form.controls['password'];
  }
  get passwordErrorMessage(): string {
    const errors = this.password?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = 'Обязательное поле';
    else if (errors?.['minlength'])
      errorMessage = 'Минимальное количество символов - 8';
    else if (errors?.['maxlength'])
      errorMessage = 'Максимальное количество символов - 32';

    return errorMessage;
  }

  private tryLogin() {
    const user: ILoginUser = {
      mail: String(this.email.value),
      password: String(this.password.value),
    };

    this.isLoading = true;

    this.authService.authUser(user).subscribe({
      error: (error: Error) => {
        this.isLoading = false;
        this.formErrorMessage = error.message;
      },
      complete: () => {
        this.formErrorMessage = '';
        this.isLoading = false;
        this.router.navigate(['/people']);
      }
    });
  }
}

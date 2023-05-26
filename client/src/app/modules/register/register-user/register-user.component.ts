import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IUser } from 'src/app/shared/models/IUser';
import { RegisterService } from 'src/app/shared/services/register.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUserModal } from './register-user-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['../register.component.css'],
})
export class RegisterUserComponent implements OnInit {

  user: IUser;

  @Output() userIdEventEmitter = new EventEmitter<number>();

  constructor(
    private rs: RegisterService, 
    private as: AuthService,
    public dialog: MatDialog,
  ) {}

  /**
   * Форма, её инициализация и валидация
   */
  form: FormGroup;
  ngOnInit() {

    this.form = new FormGroup(
      {
        email: new FormControl('', [
          Validators.required,
          // Validators.pattern('^[a-zA-Z]+[.][a-zA-Z]+@[a-zA-z]*[.]*dvfu.ru$'),
        ]),
        password: new FormControl('12345678', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
          Validators.pattern('[a-zA-Z1-9()*_-]*'),
        ]),
        passwordRepeat: new FormControl('12345678', [Validators.required]),
      },
      this._passwordValidation()
    );
  }

  /**
   * Валидатор, осуществляющий проверку введённых паролей на совпадение
   */
  private _passwordValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let password = control.get('password')?.value;
      let passwordRepeat = control.get('passwordRepeat')?.value;
      return password === passwordRepeat ? null : { notSame: true };
    };
  }

  /**
   * Геттеры для получения полей и ошибок в них
   */
  get email() {
    return this.form.controls['email'];
  }
  get emailErrorMessage(): string {
    let errors = this.email?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = 'Обязательное поле';
    else if (errors?.['pattern']) errorMessage = 'Не является почтой ДВФУ';

    return errorMessage;
  }

  get password() {
    return this.form.controls['password'];
  }
  get passwordErrorMessage(): string {
    let errors = this.password?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = 'Обязательное поле';
    else if (errors?.['pattern'])
      errorMessage = 'Использованы недопустимые символы';
    else if (errors?.['minlength'])
      errorMessage = 'Минимальное количество символов - 8';
    else if (errors?.['maxlength'])
      errorMessage = 'Максимальное количество символов - 32';

    return errorMessage;
  }

  get passwordRepeat() {
    return this.form.controls['passwordRepeat'];
  }
  get passwordRepeatErrorMessage(): string {
    let errors = this.passwordRepeat?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = 'Обязательное поле';
    else if (errors?.['pattern'])
      errorMessage = 'Использованы недопустимые символы';
    else if (errors?.['minlength'])
      errorMessage = 'Минимальное количество символов - 8';
    else if (errors?.['maxlength'])
      errorMessage = 'Максимальное количество символов - 32';

    return errorMessage;
  }

  /**
   * Метод, вызывающийся при нажатии кнопки "Подтвердить"
   * Вызывает цепочку регистрации Пользовалеля
   */
  proceed() {
    this.user = {
      mail: String(this.email.value),
      password: String(this.password.value),
    };

    this._trySendRequest();
  }

  /**
   * Обработка ошибок всей формы: проверка на совпадение введённых паролей
   *
   * Используется кастомный валидатор _passwordValidation
   */
  get formErrorMessage(): string {
    let errors = this.form.errors;
    let errorMessage = '';

    if (errors?.['notSame']) errorMessage = 'Пароли не совпадают';
    else if (this._sendDataErrorMessage)
      errorMessage = this._sendDataErrorMessage;

    return errorMessage;
  }

  /**
   * Переменная содержит текст ошибки, возникающей при взаимодействии с сервером
   */
  private _sendDataErrorMessage: string = '';

  isLoading: boolean = false;

  private userId: number;

  /**
   * Метод осуществляет запрос на сервер для регистрации нового пользователя
   */
  private _trySendRequest() {

    this.isLoading = true;

    return this.rs.registerUser(this.user).subscribe({
      next: (response: any) => { 
        this.userId = response.id;
        this._openDialog();
      },
      error: (error: Error) => {
        this._sendDataErrorMessage = error.message;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this._sendDataErrorMessage = '';
      },
    });
  }

  /**
   * Метод открывает модальное окно для ввода кода подтверждения.
   * 
   * @param [errorMessage=''] Ошибка, которая будет выведена в окне
   */
  private _openDialog(errorMessage: string = ''): void {
    const dialogRef = this.dialog.open(RegisterUserModal, {
      data: { email: this.email.value, errorMessage: errorMessage },
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(userCode => this._tryVerifyUser(userCode));
  }

  /**
   * Метод осуществляет проверку пользовательского кода.
   * 
   * @param [userCode] Пользовательский код
   */
  private _tryVerifyUser(userCode: string) {
    this.isLoading = true;

    this.rs.verifyCode(userCode, this.userId).subscribe({
      next: () => this._tryAuth(),
      error: (error: Error) => {
        this.isLoading = false;
        this._openDialog(error.message);
      },
    });
  }

  private _tryAuth() {
    this.isLoading = true;

    this.as.authUser(this.user).subscribe({
      next: () => this.userIdEventEmitter.emit(this.userId),
      error: (error: Error) => {
        this.isLoading = false;
        this._sendDataErrorMessage = error.message;
      },
    });
  }
}

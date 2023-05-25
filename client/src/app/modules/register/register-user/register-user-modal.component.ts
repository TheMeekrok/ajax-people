import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { tap } from "rxjs";
import { RegisterService } from "src/app/shared/services/register.service";

export interface IDialogData {
  email: string,
  code: string,
  errorMessage: string;
}

/**
 * Компонент модального окна
 * 
 * Открывается, если пользователь успешно прошёл регистрацию
 * 
 * @data содержит данные этого компонента
 */
@Component({
  selector: 'register-user-modal',
  templateUrl: './register-user-modal.html',
  styleUrls: ['./register-user-modal.css'],
})
export class RegisterUserModal implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RegisterUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {}

  ngOnInit(): void {}

  codeToUpperCase() {
    this.data.code = this.data.code.toUpperCase();
  }

}

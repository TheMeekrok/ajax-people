import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface IDialogData {
  email: string,
  code: string,
  errorMessage: string;
}

@Component({
  selector: 'register-user-modal.component',
  templateUrl: './register-user-modal.component.html',
  styleUrls: ['./register-user-modal.css'],
})
export class RegisterUserModal {

  constructor(
    public dialogRef: MatDialogRef<RegisterUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {}

  codeToUpperCase() { 
    this.data.code = this.data.code.toUpperCase(); 
  }
}

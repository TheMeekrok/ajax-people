import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { IUser } from "src/app/shared/models/IUser";

export interface DialogData {
  user: IUser,
}

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatDividerModule, MatButtonModule],
})
export class UserDialog {
  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
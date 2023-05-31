import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-delete-tag',
  templateUrl: './confirmation-delete-tag.component.html',
  styleUrls: ['./confirmation-delete-tag.component.css']
})
export class ConfirmationDeleteTagComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmationDeleteTagComponent>,
  @Inject(MAT_DIALOG_DATA) public data: {title: string}) {}

  onOkClick() {
    this.dialogRef.close();
  }
}

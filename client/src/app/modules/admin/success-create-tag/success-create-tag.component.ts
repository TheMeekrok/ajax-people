import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-success-create-tag',
  templateUrl: './success-create-tag.component.html',
  styleUrls: ['./success-create-tag.component.css']
})
export class SuccessCreateTagComponent {

  constructor(private dialogRef: MatDialogRef<SuccessCreateTagComponent>) {}

  onOkClick() {
    this.dialogRef.close();
  }
}

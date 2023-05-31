import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-success-post',
  templateUrl: './success-post.component.html',
  styleUrls: ['./success-post.component.css']
})
export class SuccessPostComponent {
  constructor(public dialogRef: MatDialogRef<SuccessPostComponent>) {}
  onOkClick() {
    this.dialogRef.close();
  }
}

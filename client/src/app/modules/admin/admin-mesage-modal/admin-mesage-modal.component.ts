import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-admin-mesage-modal',
  templateUrl: './admin-mesage-modal.component.html',
  styleUrls: ['./admin-mesage-modal.component.css']
})
export class AdminMesageModalComponent {

  constructor(private dialogRef: MatDialogRef<AdminMesageModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string}) {}

  onClose() {
    this.dialogRef.close(this.data);
  }
}

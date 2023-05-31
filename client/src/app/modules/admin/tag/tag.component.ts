import { Component, Input } from '@angular/core';
import { Tag } from "../../../shared/models/Tag";
import { AdminService } from "../../../shared/services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { SuccessCreateTagComponent } from "../success-create-tag/success-create-tag.component";
import { ConfirmationDeleteTagComponent } from "../confirmation-delete-tag/confirmation-delete-tag.component";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})

export class TagComponent {
  @Input() tag: Tag;
  constructor(private adminService: AdminService,
              public dialog: MatDialog) {
  }

  onDeleteTagClick() {
    const dialogRef = this.dialog.open(ConfirmationDeleteTagComponent, {
      data: {title: this.tag.title}
    });
    this.adminService.deleteTag(this.tag.id).subscribe();
  }
}

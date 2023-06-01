import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from "../../../shared/models/Tag";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDeleteTagComponent } from "../confirmation-delete-tag/confirmation-delete-tag.component";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})

export class TagComponent {
  @Input() tag: Tag;
  @Output() answer = new EventEmitter<boolean>();
  constructor(public dialog: MatDialog) {}

  onDeleteTagClick() {
    const dialogRef = this.dialog.open(ConfirmationDeleteTagComponent, {
      data: {title: this.tag.title}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.answer.emit(result.answer);
    });
  }
}

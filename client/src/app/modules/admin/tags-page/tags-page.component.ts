import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Tag } from "../../../shared/models/Tag";
import { AdminService } from "../../../shared/services/admin.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SuccessCreateTagComponent } from "../success-create-tag/success-create-tag.component";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmationDeleteTagComponent } from "../confirmation-delete-tag/confirmation-delete-tag.component";


interface Data {
  tag: Tag;
  isDeleted: boolean
}

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.css']
})
export class TagsPageComponent implements OnInit {
  @ViewChild('childContainer', { read: ViewContainerRef }) childContainer: ViewContainerRef;

  tags: Tag[];
  form: FormGroup;

  displayedColumns: string[] = ["id", "title", "delete"];
  dataSource: MatTableDataSource<Data>;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Data, filter: string) => {
      const { tag, isDeleted } = data;
      const matchesTitle = tag.id.toString().toLowerCase().includes(filter);
      const matchesUserId = tag.title.toString().includes(filter);
      return matchesTitle  || matchesUserId;
    };
    this.dataSource.filter = filterValue;
    console.log(this.dataSource.filteredData);
  }

  constructor(private adminService: AdminService,
              public dialog: MatDialog,
  ) {
    this.uploadTags();
  }
  ngOnInit() {
    this.form = new FormGroup({
      newTag: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s":;,=-]*$/),
      ])
    });
  }

/**
 * ОБновляет тэги при удалении / добавлении
*/
  uploadTags() {
    this.tags = [];
    this.adminService.getTags().subscribe( {
        next: (data) => {
          this.tags = data;
          const dataSource: Data[] = [];
          for (const t of this.tags) {
            dataSource.push({
              tag: t,
              isDeleted: false,
            })
          }
          this.dataSource  = new MatTableDataSource(dataSource)
        },
        error: (error: Error) => {
          console.log(error);
        },
      }
    )
  }
  get getTagErrorMessage(): string {
    const errors = this.form.controls['newTag']?.errors;
    if (errors?.['required']) {
      return "Введите новый тэг";
    }
    if (errors?.['minlength']) {
      return "Минимум 3 символа";
    }
    if (errors?.['pattern']) {
      return "Недопустимые символы";
    }
    return "";
  }

  onCreateTagClick() {
    if (this.form.invalid) {
      return;
    }
    const newTag = this.form.controls['newTag'].value;
    this.adminService.createTag({title: newTag}).subscribe();
    const dialogRef = this.dialog.open(SuccessCreateTagComponent);
    dialogRef.afterClosed().subscribe();
    this.form.reset();
    this.uploadTags();
  }


  onDeleteClick($event: Event, data: Data) {
    if (data.isDeleted) {
      return;
    }
    let answer: boolean;
    const dialogRef = this.dialog.open(ConfirmationDeleteTagComponent, {
      data: {title: data.tag.title}
    });
    dialogRef.afterClosed().subscribe(result => {
      answer = result.answer;
      if (!answer) {
        return;
      }
      this.adminService.deleteTag(data.tag.id).subscribe( {
          next: () => console.log("success"),
          error: (error: Error) => console.log(error),
        }
      )
      data.isDeleted = true;
    });
  }

}

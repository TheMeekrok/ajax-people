import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Tag } from "../../../shared/models/Tag";
import { AdminService } from "../../../shared/services/admin.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";


interface Data {
  id: number
  title: string
  isDeleted: boolean
}

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.css'],
})
export class TagsPageComponent implements OnInit {
  isLoading: boolean;
  @ViewChild('childContainer', { read: ViewContainerRef }) childContainer: ViewContainerRef;

  tags: Tag[];
  form: FormGroup;

  displayedColumns: string[] = ["id", "title", "delete"];
  dataSource: MatTableDataSource<Data>;

  constructor(private adminService: AdminService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar
  ) {
    this.isLoading = true;
    this.uploadTags();
  }
  ngOnInit() {
    this.form = new FormGroup({
      newTag: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ])
    });
  }

  /**
   * ОБновляет тэги при удалении / добавлении
   */
  uploadTags() {
    this.isLoading = true;
    this.adminService.getTags().subscribe( {
        next: (data) => {
          this.tags = data;
          const dataSource: Data[] = [];
          for (const t of this.tags) {
            dataSource.push({
              id: t.id,
              title: t.title,
              isDeleted: false,
            })
          }
          this.dataSource  = new MatTableDataSource(dataSource)
        },
        error: (error: Error) => {
          console.log(error);
        },
      complete: () => this.isLoading = false
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
    if (errors?.['maxlength']) {
      return "Максимум 20 символов";
    }
    return "";
  }

  showMessage(message: string) {
    this.snackBar.open(message, "Ок");
  }

  onCreateTagClick() {
    if (this.form.invalid) {
      return;
    }
    const newTag = this.form.controls['newTag'].value;
    this.adminService.createTag({title: newTag}).subscribe();
    this.showMessage("Тэг успешно добавлен");
    this.form.reset();
    this.uploadTags();

  }


  onDeleteClick($event: Event, data: Data) {
    if (data.isDeleted) {
      return;
    }
    this.adminService.deleteTag(data.id).subscribe( {
        next: () => console.log("success"),
        error: (error: Error) => console.log(error),
      }
    )
    data.isDeleted = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

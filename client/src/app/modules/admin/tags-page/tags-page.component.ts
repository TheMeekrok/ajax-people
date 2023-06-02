import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Tag } from "../../../shared/models/Tag";
import { AdminService } from "../../../shared/services/admin.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SuccessCreateTagComponent } from "../success-create-tag/success-create-tag.component";

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.component.html',
  styleUrls: ['./tags-page.component.css']
})
export class TagsPageComponent implements OnInit {
  @ViewChild('childContainer', { read: ViewContainerRef }) childContainer: ViewContainerRef;

  tags: Tag[];
  form: FormGroup;
  loading = false;


  constructor(private adminService: AdminService,
              public dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      newTag: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s":;,=-]*$/),
      ])
    });
    this.uploadTags();
  }

/**
 * ОБновляет тэги при удалении / добавлении
*/
  uploadTags() {
    this.tags = [];
    this.loading = true;
    this.adminService.getTags().subscribe( {
        next: (data) => {
          this.tags = data;
          this.loading = false;
        },
        error: (error: Error) => {
          console.log(error);
        }
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

/**
 * Метод, получающий ответ от компонента tag
 * @param answer - подтверждено ли удаление
 * @param id - id тэга
*/
  onGetAnswerToDeletion(answer: boolean, id: number) {
    if (!answer) {
      return;
    }
    this.adminService.deleteTag(id).subscribe( {
        next: () => console.log("success"),
        error: (error: Error) => console.log(error),
      }
    ).unsubscribe();
  this.uploadTags();
  }
}

import { Component, OnInit } from '@angular/core';
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
  loading: boolean = true;

  tags: Tag[];
  form: FormGroup;

  constructor(private adminService: AdminService,
              public dialog: MatDialog,
  ) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      newTag: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ])
    });
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
    let errors = this.form.controls['newTag']?.errors;
    if (errors?.['required']) {
      return "Введите новый тэг";
    }
    if (errors?.['minlength']) {
      return "Минимум 3 символа";
    }
    return "";
  }

  onCreateTagClick() {
    if (this.form.invalid) {
      return;
    }
    let newTag = this.form.controls['newTag'].value;
    this.adminService.createTag({title: newTag}).subscribe();
    const dialogRef = this.dialog.open(SuccessCreateTagComponent);
    dialogRef.afterClosed().subscribe();
  }
}


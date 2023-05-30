import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IPost } from "../../../shared/models/Post";
import { IInterest } from "../../../shared/models/Interest";
import { PostService } from "../../../shared/services/post.service";
import { SuccessPostComponent } from "../success-post/success-post.component";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  form: FormGroup;
  interests: IInterest[]
  isTagSelected: boolean
  constructor(
    public dialog: MatDialog,
    private postService: PostService,
    public dialogRef: MatDialogRef<CreatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPost,
) {
    this.form = new FormGroup({
      text: new FormControl('',[
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\.":;,=-]*$/),
        Validators.minLength(10),
        Validators.maxLength(255)
      ]),
      tags: new FormControl([], [Validators.minLength(1)])
    });
    this.postService.getTags().subscribe(
      data => {
        this.interests = data
      }
    )
  }

  getTextErrorString() {
    const error = this.form.controls['text'].errors;
    if (error?.['required']) {
      return 'Обязательное поле'
    }
    if (error?.['pattern']) {
      return 'Текст содержит недопустимые символы'
    }
    if (error?.['minlength']) {
      return 'Минимум 10 символов'
    }
    if (error?.['maxlength']) {
      return 'Максимум 255 символов'
    }
    return ''
  }


  onPostClick() {
    if (this.form.controls['tags'].value.length < 1) {
      this.isTagSelected = true
      return
    }
    else {
      this.isTagSelected = false
    }
    if (this.form.valid) {
      this.data = {
        text: this.form.controls['text']?.value,
        tags: this.form.controls['tags']?.value,
        author: '',
        userId: 1,
      }
      this.dialogRef.close(this.data)
    }
    const dialogRef = this.dialog.open(SuccessPostComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

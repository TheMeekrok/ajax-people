import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IPost } from "../../../shared/models/Post";
import { PostService } from "../../../shared/services/post.service";
import { Tag } from 'src/app/shared/models/Tag';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  loading = true;
  form: FormGroup;
  tags: Tag[];
  isTagSelected: boolean;

  constructor(
    public dialog: MatDialog,
    private postService: PostService,
    public dialogRef: MatDialogRef<CreatePostComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPost,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      text: new FormControl('',[
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255)
      ]),
      tags: new FormControl([], [
        Validators.minLength(1),
        Validators.required,
        Validators.maxLength(10),
      ])
    });
    this.postService.getTags().subscribe(
      (data: Tag[]) => {
        this.tags = data
        this.loading = false;
      }
    )
  }

  getTextErrorString() {
    const error = this.form.controls['text'].errors;
    if (error?.['minlength']) {
      return 'Минимум 10 символов'
    }
    if (error?.['maxlength']) {
      return 'Максимум 255 символов'
    }
    return ''
  }

  get tagsError(): string {
    const error = this.form.get('tags')?.errors;

    if (error?.['minlength']) {
      return 'Выберите хотя бы один тег';
    }
    if (error?.['maxlength']) {
      return 'Не более 10';
    }

    return ''
  }

  savePostError = '';

  onPostClick(): void {
    this.data = {
      text: this.form.controls['text']?.value,
      tags: this.form.controls['tags']?.value,
      author: '',
      userId: 1,
    }

    this.loading = true;

    this.postService.savePost(this.data).subscribe({
      error: (error: Error) => {
        this.loading = false;
        this.savePostError = error.message;
      },
      complete: () => {
        this.loading = false;
        this.snackBar.open('Публикация отправлена на проверку', 'ОК');
        this.dialogRef.close();
      }
    })
  }
}

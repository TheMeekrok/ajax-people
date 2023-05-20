import {Component, EventEmitter, Inject, Input, Output, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IPost} from "../../../shared/models/Post";
import {IInterest} from "../../../shared/models/Interest";
import {DataService} from "../../../shared/services/data.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  form: FormGroup;
  interests: IInterest[]
  isInterestsValid: boolean

  constructor(
    private dataService: DataService,
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
    this.dataService.getInterests().subscribe(
      data => {
        this.interests = data
      }
    )
  }

  getTextErrorString() {
    let error = this.form.controls['text'].errors;
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
      this.isInterestsValid = true
      return
    }
    else {
      this.isInterestsValid = false
    }
    if (this.form.valid) {
      this.data = {
        text: this.form.controls['text']?.value,
        tags: this.form.controls['tags']?.value,
        userId: 1
      }
      this.dialogRef.close(this.data)
    }
  }
}

import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../publications-page/publications-page.component";


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  form: FormGroup;

  @Input('mat-dialog-close')
  dialogResult: Post

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: Post,

) {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
          Validators.minLength(3),
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\.":;,=-]*$/)
      ]),
      text: new FormControl('',[
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\.":;,=-]*$/),
        Validators.minLength(10),
        Validators.maxLength(255)
      ]),
    });
  }

  getTitleErrorString(): string {
    let error = this.form.controls['title'].errors;
    if (!error) {
      return ''
    }
    if (error['required']) {
      return 'Обязательное поле'
    }
    if (error['minlength']) {
      return 'Минимум 3 символа'
    }
    if (error['pattern']) {
      return 'Заголовок содержит недопустимые символы'
    }
    return ''
  }

  getTextErrorString() {
    let error = this.form.controls['text'].errors;
    if (!error) {
      return ''
    }
    if (error['required']) {
      return 'Обязательное поле'
    }
    if (error['pattern']) {
      return 'Текст содержит недопустимые символы'
    }
    if (error['minlength']) {
      return 'Минимум 10 символов'
    }
    if (error['maxlength']) {
      return 'Максимум 255 символов'
    }
    return ''
  }

  onSubmit() {
    close()
  }
}

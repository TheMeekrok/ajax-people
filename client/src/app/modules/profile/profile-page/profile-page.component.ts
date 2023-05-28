import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
// import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/User";
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit{

  user: User
  form: FormGroup
  photo: FormControl;
  constructor() {
  }

  getStatus(): string {
    switch (this.user.statusUser) {
      case "student":
        return "Студент"
      case "teacher":
        return "Преподаватель"
      case "graduated":
        return "Выпускник"
      default:
        return ""
      }
  }

  ngOnInit() {
    // this.user = this.authService.user
    this.photo = new FormControl('', Validators.required);

      this.form = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\.":;,=-]*$/),
          Validators.minLength(3)
        ]),
        surname: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\.":;,=-]*$/),
          Validators.minLength(3)
        ]),
        age: new FormControl('', [
            Validators.min(0),
            Validators.required,
        ]),
        admissionYear: new FormControl('', [
          Validators.min(0),
          Validators.required,
        ]),
        graduationYear: new FormControl('', [
          Validators.min(0),
          Validators.required,
        ]),
    });
  }

  getPhotoErrorString() {
    return this.form.controls['photo'].errors!['required'] ? "Выберите фото" : ""
  }

  getNameErrorString(): string {
    const error = this.form.controls['name'].errors;
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
      return 'Имя содержит недопустимые символы'
    }
    return ''
  }

  getSurnameErrorString(): string {
    const error = this.form.controls['surname'].errors;
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
      return 'Фамилия содержит недопустимые символы'
    }
    return ''
  }
  getAgeErrorString(): string {
    const error = this.form.controls['age'].errors;
    if (!error) {
      return ''
    }
    if (error['required']) {
      return 'Обязательное поле'
    }
    if (error['min']) {
      return 'Некорректный возраст'
    }
    return ''
  }

  onChangePhotoClick() {
    if (this.photo.invalid) {
      return
    }
  }

  onChangeInfoClick() {
    if (this.form.invalid) {
      return
    }
    alert("Данные изменены")
  }


}

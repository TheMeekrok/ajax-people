import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { IFaculty } from 'src/app/shared/models/Faculty';
import { ISchool } from 'src/app/shared/models/School';
import { IUser } from 'src/app/shared/models/IUser';
import { RegisterService } from 'src/app/shared/services/register.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-register-profile-info',
  templateUrl: './register-profile-info.component.html',
  styleUrls: ['../register.component.css'],
  providers: [UserDataService]
})
export class RegisterProfileInfoComponent implements OnInit {

  @Input() userId = 0;
  @Output() continueRegister = new EventEmitter<any>();

  constructor(private uds: UserDataService, private rs: RegisterService) {}

  form: FormGroup;
  
  formErrorMessage: string = '';
  isLoading = false;

  // Определяет появление других полей для ввода
  userStatus: string;

  private faculties: IFaculty[] = [];
  filteredFaculties: Observable<IFaculty[]>;

  private schools: ISchool[] = [];
  filteredSchools: Observable<ISchool[]>;

  ngOnInit(): void {

    // Инициализация формы
    this.form = new FormGroup({

      firstName: new FormControl('', [
        Validators.required, 
        Validators.pattern('[а-яёА-яa-zA-z]+-?[а-яёА-яa-zA-z]+'), 
        Validators.maxLength(16)
      ]),

      secondName: new FormControl('', [
        Validators.required, 
        Validators.pattern('[а-яёА-яa-zA-z]+-?[а-яёА-яa-zA-z]+'), 
        Validators.maxLength(16)
      ]),
      
      age: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.required,
        Validators.max(100),
        Validators.min(6),
      ]),

      admissionYear: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.required,
        Validators.max((new Date()).getFullYear()),
        Validators.min(1900),
      ]),

      userStatus: new FormControl('', [Validators.required]),
      courseNumber: new FormControl(),
      educationLevel: new FormControl(),
      faculty: new FormControl(),
      school: new FormControl()

    });

    // Загрузка данных (факультеты, школы) с сервера
    this.uds.getFaculties().subscribe({next: (data: IFaculty[]) => this.faculties = data});
    this.uds.getSchools().subscribe({next: (data: ISchool[]) => this.schools = data});

    // Обработка поиска в полях для выбора факультета и школы
    this.filteredFaculties = this.form.controls['faculty'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const title = typeof value === 'string' ? value : value?.title;
        return title ? this._filterFaculties(title as string) : this.faculties.slice();
      }),
    )

    this.filteredSchools = this.form.controls['school'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const title = typeof value === 'string' ? value : value?.title;
        return title ? this._filterSchools(title as string) : this.schools.slice();
      }),
    )
  }

  // Геттеры и обработчики ошибок для всех полей формы
  get firstName() { return this.form.get('firstName'); }
  get firstNameErrorMessage(): string {
    let errors = this.firstName?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get secondName() { return this.form.get('secondName'); }
  get secondNameErrorMessage(): string {
    let errors = this.secondName?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get age() { return this.form.get('age'); }
  get ageErrorMessage(): string {
    let errors = this.age?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['max'] || errors?.['min']) errorMessage = "Введите настоящий возраст";
    else if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get admissionYear() { return this.form.get('admissionYear'); }
  get admissionYearErrorMessage(): string {
    let errors = this.admissionYear?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get status() { return this.form.get('userStatus'); }
  get statusErrorMessage(): string {
    let errors = this.age?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";

    return errorMessage;
  }

  get educationLevel() { return this.form.get('educationLevel'); }
  get school() { return this.form.get('school'); }
  get faculty() { return this.form.get('faculty'); }
  

  // Обработчик для корректного отображения названия факультета/школы
  displayFunctionFaculty(object: IFaculty): string { return object?.title || ''; }

  displayFunctionSchool(object: ISchool): string { return object?.title || ''; }

  private _filterFaculties(value: string): IFaculty[] {
    const filterValue = value.toLowerCase();
    return this.faculties.filter(faculty => faculty.title.toLowerCase().includes(filterValue));
  }

  private _filterSchools(value: string): ISchool[] {
    const filterValue = value.toLowerCase();
    return this.schools.filter(school => school.title.toLowerCase().includes(filterValue));
  }

  proceed() {
    if (this.form.valid) {
      let user: IUser = {
        firstName: String(this.firstName?.value),
        lastName: String(this.secondName?.value),
        age: Number(this.age?.value),
        statusUserId: Number(this.status?.value),
        educationLevelId: Number(this.educationLevel?.value), 
        admissionYear: Number(this.admissionYear?.value),
        schoolId: Number(this.school?.value?.id),
        studyProgramId: Number(this.faculty?.value?.id),
      }

      this.isLoading = true;

      this.rs.updateUserData(user, this.userId).subscribe({
        error: (error: Error) => this.formErrorMessage = error.message,
        complete: () => { 
          this.isLoading = false;
          this.continueRegister.emit();
        },
      });
    }
  }
}

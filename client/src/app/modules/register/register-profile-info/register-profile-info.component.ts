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
  @Output() onUserDataComplete = new EventEmitter<number>();

  constructor(private uds: UserDataService, private rs: RegisterService) {}

  form: FormGroup;
  
  formErrorMessage = '';
  isLoading = false;

  userStatus: string;

  private faculties: IFaculty[] = [];
  filteredFaculties: Observable<IFaculty[]>;

  private schools: ISchool[] = [];
  filteredSchools: Observable<ISchool[]>;

  ngOnInit(): void {

    this.form = new FormGroup({

      firstName: new FormControl('', [
        Validators.required, 
        Validators.pattern('[а-яёА-яa-zA-z]+-?[а-яёА-яa-zA-z]+'), 
        Validators.maxLength(16)
      ]),

      secondName: new FormControl('', [
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
        Validators.max((new Date()).getFullYear()),
        Validators.min(1900),
      ]),

      userStatus: new FormControl('', [Validators.required]),
      courseNumber: new FormControl(),
      educationLevel: new FormControl('', [Validators.required]),
      faculty: new FormControl(),
      school: new FormControl(),

      telegram: new FormControl('', [
        Validators.maxLength(32),
        Validators.pattern('@[0-9a-zA-z]+'),
      ]),

      vk: new FormControl('', [
        Validators.maxLength(32),
        Validators.pattern('vk.com/[0-9a-zA-z_-]+'),
      ]),

      phoneNumber: new FormControl('', [
        Validators.pattern('[\+7][0-9]{11}'),
      ]),
    });

    this.uds.getFaculties().subscribe({next: (data: IFaculty[]) => this.faculties = data});
    this.uds.getSchools().subscribe({next: (data: ISchool[]) => this.schools = data});

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

  get firstName() { return this.form.get('firstName'); }
  get firstNameErrorMessage(): string {
    const errors = this.firstName?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get secondName() { return this.form.get('secondName'); }
  get secondNameErrorMessage(): string {
    const errors = this.secondName?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get age() { return this.form.get('age'); }
  get ageErrorMessage(): string {
    const errors = this.age?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['max'] || errors?.['min']) errorMessage = "Введите настоящий возраст";
    else if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get admissionYear() { return this.form.get('admissionYear'); }
  get admissionYearErrorMessage(): string {
    const errors = this.admissionYear?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";
    else if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get status() { return this.form.get('userStatus'); }
  get statusErrorMessage(): string {
    const errors = this.status?.errors;
    let errorMessage = '';

    if (errors?.['required']) errorMessage = "Обязательное поле";

    return errorMessage;
  }

  get educationLevel() { return this.form.get('educationLevel'); }
  get school() { return this.form.get('school'); }
  get faculty() { return this.form.get('faculty'); }
  
  get telegram() { return this.form.get('telegram'); }
  get telegramErrorMessage(): string {
    const errors = this.telegram?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только латиница и цифры";
    else if (errors?.['maxlength']) errorMessage = "Не более 32 символов";

    return errorMessage;
  }

  get vk() { return this.form.get('vk'); }
  get vkErrorMessage(): string {
    const errors = this.vk?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Не является ссылкой";
    else if (errors?.['maxlength']) errorMessage = "Не более 32 символов";

    return errorMessage;
  }

  get phoneNumber() { return this.form.get('phoneNumber'); }
  get phoneNumberErrorMessage(): string {
    const errors = this.phoneNumber?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Не является номером телефона";

    return errorMessage;
  }


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

  onSubmitData() { this.tryUpdateUserData(); }

  private tryUpdateUserData() {
    const user: IUser = {
      firstName: String(this.firstName?.value),
      lastName: String(this.secondName?.value),
      age: Number(this.age?.value),
      statusUserId: Number(this.status?.value),
      educationLevelId: Number(this.educationLevel?.value), 
      admissionYear: Number(this.admissionYear?.value),
      schoolId: Number(this.school?.value?.id),
      studyProgramId: Number(this.faculty?.value?.id),
      telegram: String(this.telegram?.value),
      vk: String(this.vk?.value),
      telephone: String(this.phoneNumber?.value),
    }

    this.isLoading = true;

    this.rs.updateUserData(user, this.userId).subscribe({
      error: (error: Error) => this.formErrorMessage = error.message,
      complete: () => { 
        this.isLoading = false;
        this.onUserDataComplete.emit();
      },
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
import { ISchool } from 'src/app/shared/models/School';
import { IFaculty } from 'src/app/shared/models/Faculty';
import { Observable, map, startWith } from 'rxjs';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { RegisterService } from 'src/app/shared/services/register.service';
import { IUser } from 'src/app/shared/models/IUser';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from "../../../shared/services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit{

  constructor(
    private userDataService: UserDataService,
    private registerService: RegisterService,
    private utilsService: UtilsService,
    private authService: AuthService,
    private router: Router,
  ) { }

  formErrorMessage = '';

  ngOnInit(): void {
    this.tryGetCurrentUser();
    this.initForm();
  }

  user: IUser = {};
  avatarPath = '../../../../assets/user/default_avatar.svg';

  private tryGetCurrentUser() {
    this.loading = true;
    this.userDataService.getCurrentUser().subscribe({
      next: (response: IUser) => {
        this.user = response;
        this.initLists();
        this.tryGetAvatar();
      },
      complete: () => this.loading = false,
    });
  }

  tryGetAvatar() {
    if (!this.user.id) return;

    this.userDataService.getUserAvatar(this.user.id).subscribe({
      next: (response: string) => {
        if (response) this.avatarPath = `data:image/png;base64,${response}`
      },
    })
  }

  updatePage(): void {
    this.tryGetCurrentUser();
    this.utilsService.scrollToTop();
  }

  onExitClick(): void {
    this.authService.exitUser().subscribe(() => this.router.navigate(['/']));
  }

  private faculties: IFaculty[] = [];
  filteredFaculties: Observable<IFaculty[]>;

  private schools: ISchool[] = [];
  filteredSchools: Observable<ISchool[]>;

  form: FormGroup;

  private initLists() {
    if (this.user.schoolId) {
      this.userDataService.getSchoolById(this.user.schoolId).subscribe({
        next: (result: ISchool[]) => {
          this.school?.setValue(result?.[0]);
        },
      })
    }

    if (this.user.studyProgramId) {
      this.userDataService.getFacultyById(this.user.studyProgramId).subscribe({
        next: (result: IFaculty[]) => {
          this.faculty?.setValue(result?.[0]);
        },
      })
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [
        Validators.pattern('[а-яёА-яa-zA-z]+-?[а-яёА-яa-zA-z]+'),
        Validators.maxLength(30)
      ]),

      secondName: new FormControl('', [
        Validators.pattern('[а-яёА-яa-zA-z]+-?[а-яёА-яa-zA-z]+'),
        Validators.maxLength(30)
      ]),

      age: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.max(100),
        Validators.min(12),
      ]),

      admissionYear: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.max((new Date()).getFullYear()),
        Validators.min(1900),
      ]),

      userStatus: new FormControl(),
      courseNumber: new FormControl(),
      educationLevel: new FormControl(),
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

    this.userDataService.getFaculties().subscribe({next: (data: IFaculty[]) => this.faculties = data});
    this.userDataService.getSchools().subscribe({next: (data: ISchool[]) => this.schools = data});

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

  onSubmitData() {
    const newUser: IUser = {
      firstName: String(this.firstName?.value) || this.user.firstName,
      lastName: String(this.secondName?.value) || this.user.lastName,
      age: Number(this.age?.value) || this.user.age,
      statusUserId: Number(this.status?.value),
      educationLevelId: Number(this.educationLevel?.value),
      admissionYear: Number(this.admissionYear?.value) || this.user.admissionYear,
      schoolId: Number(this.school?.value?.id),
      studyProgramId: Number(this.faculty?.value?.id),
      telegram: String(this.telegram?.value) || this.user.personalData?.telegram,
      vk: String(this.vk?.value) || this.user.personalData?.vk,
      telephone: String(this.phoneNumber?.value) || this.user.personalData?.telephone,
    }

    this.tryUpdateUserData(newUser);
  }

  loading = false;

  private tryUpdateUserData(user: IUser) {
    if (!this.user.id) return;

    this.utilsService.scrollToTop();
    this.loading = true;

    this.registerService.updateUserData(user, this.user.id).subscribe({
      error: (error: Error) => console.log(error),
      complete: () => this.loading = false,
    });
  }

  get firstName() {
    return this.form.get('firstName');
  }
  get firstNameErrorMessage(): string {
    const errors = this.firstName?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get secondName() {
    return this.form.get('secondName');
  }
  get secondNameErrorMessage(): string {
    const errors = this.secondName?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только латиница или кириллица";
    else if (errors?.['maxlength']) errorMessage = "Не более 16 символов";

    return errorMessage;
  }

  get age() {
    return this.form.get('age');
  }
  get ageErrorMessage(): string {
    const errors = this.age?.errors;
    let errorMessage = '';

    if (errors?.['max'] || errors?.['min']) errorMessage = "Введите настоящий возраст";
    else if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get admissionYear() {
    return this.form.get('admissionYear');
  }
  get admissionYearErrorMessage(): string {
    const errors = this.admissionYear?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только цифры";

    return errorMessage;
  }

  get status() {
    return this.form.get('userStatus');
  }

  get educationLevel() {
    return this.form.get('educationLevel');
  }

  get school() {
    return this.form.get('school');
  }

  get faculty() {
    return this.form.get('faculty');
  }

  get telegram() {
    return this.form.get('telegram');
  }
  get telegramErrorMessage(): string {
    const errors = this.telegram?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Только латиница и цифры";
    else if (errors?.['maxlength']) errorMessage = "Не более 32 символов";

    return errorMessage;
  }

  get vk() {
    return this.form.get('vk');
  }
  get vkErrorMessage(): string {
    const errors = this.vk?.errors;
    let errorMessage = '';

    if (errors?.['pattern']) errorMessage = "Не является ссылкой";
    else if (errors?.['maxlength']) errorMessage = "Не более 32 символов";

    return errorMessage;
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
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
}

import { Component, HostListener, OnInit } from '@angular/core';
import { UserDataService } from '../../../shared/services/user-data.service';
import { IUser } from 'src/app/shared/models/IUser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IInterest } from 'src/app/shared/models/Interest';
import { ISchool } from 'src/app/shared/models/School';
import { IFaculty } from 'src/app/shared/models/Faculty';
import { Observable, map, merge, startWith, tap } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css'],
})
export class PeoplePageComponent implements OnInit {

  constructor(
    private userDataService: UserDataService,
    private utilsService: UtilsService,
  ) {}

  currentPage = 0;
  users: IUser[] = [];
  usersFilter: IUser = {};
  usersEnd = false;

  interests: IInterest[] = [];
  form: FormGroup;

  interestsLoading = false;
  usersLoading = false;

  private faculties: IFaculty[] = [];
  filteredFaculties: Observable<IFaculty[]>;
  private schools: ISchool[] = [];
  filteredSchools: Observable<ISchool[]>;

  ngOnInit(): void {
    this.initForm();
    this.initLists();
    this.initInterests();
    this.getUsers(this.currentPage);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.currentPage++;
      this.getUsers(this.currentPage);
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      interestsChips: new FormControl(),
      age: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.max(100),
        Validators.min(6),
      ]),
      admissionYear: new FormControl('', [
        Validators.pattern('[0-9]*'),
        Validators.max((new Date()).getFullYear()),
        Validators.min(1900),
      ]),

      userStatus: new FormControl(),
      educationLevel: new FormControl(),
      faculty: new FormControl(),
      school: new FormControl(),
    });
  }
  
  private initLists(): void {
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

  private _filterFaculties(value: string): IFaculty[] {
    const filterValue = value.toLowerCase();
    return this.faculties.filter(faculty => faculty.title.toLowerCase().includes(filterValue));
  }

  private _filterSchools(value: string): ISchool[] {
    const filterValue = value.toLowerCase();
    return this.schools.filter(school => school.title.toLowerCase().includes(filterValue));
  }

  private initInterests() {
    this.interestsLoading = true;

    this.userDataService.getInterests().subscribe({
      next: (interests) => this.interests = interests,
      error: () => this.interestsLoading = false,    
      complete: () => this.interestsLoading = false,
    });
  }

  onFilterButtonClick(): void {
    this.utilsService.scrollToTop();

    this.users = [];
    this.usersEnd = false;
    this.currentPage = 0;

    this.usersFilter = {
      age: Number(this.age?.value),
      statusUserId: Number(this.status?.value),
      educationLevelId: Number(this.educationLevel?.value), 
      admissionYear: Number(this.admissionYear?.value),
      schoolId: Number(this.school?.value?.id),
      studyProgramId: Number(this.faculty?.value?.id),
      interestIds: this.selectInterests(),
    }

    this.getUsers(this.currentPage);
  }

  private getUsers(page: number) {
    if (this.usersEnd) {
      return;
    }

    this.usersLoading = true;

    this.userDataService.getUsers(10, page, this.usersFilter).subscribe({
      next: (result: IUser[]) => {
        if (!(result instanceof Array)) {
          this.usersEnd = true;
          return;
        }
        this.users = this.users.concat(result);
      },
      error: () => this.usersLoading = false,
      complete: () => this.usersLoading = false,
    });
  }

  get interestsChips() { return this.form.get('interestsChips') }

  private selectInterests(): string {
    const interestsIds: number[] = [];
    this.interestsChips?.value?.forEach((chip: string) => {
      const id = this.interests.find(element => element.title === chip)?.id;
      if (id) interestsIds.push(id);
    });

    return interestsIds.join(',');
  }

  get age() { return this.form.get('age'); }
  get ageErrorMessage(): string {
    const errors = this.age?.errors;
    let errorMessage = '';

    if (errors?.['max'] || errors?.['min']) errorMessage = "Введите настоящий возраст";
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
  get educationLevel() { return this.form.get('educationLevel'); }
  get school() { return this.form.get('school'); }
  get faculty() { return this.form.get('faculty'); }

  displayFunctionFaculty(object: IFaculty): string { return object?.title || ''; }
  displayFunctionSchool(object: ISchool): string { return object?.title || ''; }
}

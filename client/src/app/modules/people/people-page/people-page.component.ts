import { Component, HostListener, OnInit } from '@angular/core';
import { UserDataService } from '../../../shared/services/user-data.service';
import { IUser } from 'src/app/shared/models/IUser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IInterest } from 'src/app/shared/models/Interest';
import { ISchool } from 'src/app/shared/models/School';
import { IFaculty } from 'src/app/shared/models/Faculty';
import { Observable, map, merge, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css'],
})
export class PeoplePageComponent implements OnInit {

  constructor(private userDataService: UserDataService) {}

  currentPage: number = 0;
  users: IUser[] = [];
  usersFilter: IUser = {};
  usersEnd: boolean = false;

  interests: IInterest[] = [];
  form: FormGroup;

  interestsLoading: boolean = false;
  usersLoading: boolean = false;

  private faculties: IFaculty[] = [];
  filteredFaculties: Observable<IFaculty[]>;
  private schools: ISchool[] = [];
  filteredSchools: Observable<ISchool[]>;

  ngOnInit(): void {
    this.initForm();
    this.initLists();
    this.initInterests();
    this.getUsers(this.currentPage);

    merge(
      ...Object.keys(this.form.controls).map(
        (controlName: string) =>
          this.form.get(controlName)?.valueChanges.pipe(
            tap((value) => { 
              this.filterUsers(controlName, value);
            })
          )
      )
    ).subscribe();
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

  private filterUsers(controlName: string, value: any) {
    this.users = [];
    this.usersEnd = false;
    this.currentPage = 0;

    switch (controlName) {
      case 'interestsChips':
        this.usersFilter.interestIds = this.selectInterests();
        break;
      case 'age':
        this.usersFilter.age = Number(value);
        break;
      case 'admissionYear':
        this.usersFilter.admissionYear = Number(value);
        break;
      case 'userStatus':
        this.usersFilter.statusUserId = Number(value);
        break;
      case 'educationLevel':
        this.usersFilter.educationLevelId = Number(value);
        break;
      case 'faculty':
        this.usersFilter.studyProgramId = Number(value?.id | 0);
        break;
      case 'school':
        this.usersFilter.schoolId = Number(value?.id | 0);
        break;
    }

    this.getUsers(this.currentPage);
  }

  private getUsers(page: number) {
    this.usersLoading = true;

    this.userDataService.getUsers(5, page, this.usersFilter).subscribe({
      next: (result: IUser[]) => {
        console.log(result)
        if (!result || result.length == 0) {
          this.usersEnd = true;
          console.log(this.usersEnd);
          return;
        }
        this.users = this.users.concat(result);
      },
      error: (error: Error) => console.log(error),
      complete: () => this.usersLoading = false,
    });
  }

  get interestsChips() { return this.form.get('interestsChips') };

  private selectInterests(): string {
    const interestsIds: number[] = [];
    this.interestsChips?.value.forEach((chip: string) => {
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

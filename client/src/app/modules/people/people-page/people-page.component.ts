import { Component, OnInit } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ISchool } from '../../../shared/models/School';
import { IFaculty } from '../../../shared/models/Faculty';
import { UserDataService } from '../../../shared/services/user-data.service';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css'],
})
export class PeoplePageComponent implements OnInit {
  form: FormGroup;
  // users$: User[];
  isFiltersUse: boolean;
  filtersButtonText: string;

  faculties: IFaculty[];
  filteredFaculties: Observable<IFaculty[]>;

  schools: ISchool[];
  filteredSchools: Observable<ISchool[]>;

  courses: number[];

  constructor(
    private router: Router,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    // this.userDataService.getUsers().subscribe((data) => {
    //   this.users$ = data;
    // });
    this.isFiltersUse = false;
    this.filtersButtonText = 'Добавить фильтры';
    this.courses = Array.apply(undefined, Array(6)).map((e, i) => i + 1);

    this.form = new FormGroup({
      school: new FormControl(''),
      faculty: new FormControl(''),
      course: new FormControl(),
    });
    this.userDataService
      .getFaculties()
      .subscribe({ next: (data: IFaculty[]) => (this.faculties = data) });
    this.userDataService
      .getSchools()
      .subscribe({ next: (data: ISchool[]) => (this.schools = data) });

    this.filteredSchools = this.form.controls['school'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const title = typeof value === 'string' ? value : value?.title;
        return title
          ? this._filterSchools(title as string)
          : this.schools.slice();
      })
    );

    this.filteredFaculties = this.form.controls['faculty'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const title = typeof value === 'string' ? value : value?.title;
        return title
          ? this._filterFaculties(title as string)
          : this.faculties.slice();
      })
    );
  }

  onUseFiltersClick() {
    this.isFiltersUse = !this.isFiltersUse;
    this.filtersButtonText = this.isFiltersUse
      ? 'Убрать фильтры'
      : 'Добавить фильтры';
    if (!this.isFiltersUse) {
      // this.userDataService.getUsers().subscribe((data) => {
      //   this.users$ = data;
      // });
    }
  }

  // openUserProfile(user: User) {
  //   this.router.navigate(['/main/profile', user.id]);
  // }

  displayFunction(object: IFaculty | ISchool): string {
    return object?.title || '';
  }

  private _filterFaculties(value: string): IFaculty[] {
    const filterValue = value.toLowerCase();
    return this.faculties.filter((faculty) =>
      faculty.title.toLowerCase().includes(filterValue)
    );
  }

  private _filterSchools(value: string): ISchool[] {
    const filterValue = value.toLowerCase();
    return this.schools.filter((school) =>
      school.title.toLowerCase().includes(filterValue)
    );
  }

  onSelect(event: any) {
  }
}

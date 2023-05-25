import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../shared/services/user-data.service';
import { IUser } from 'src/app/shared/models/IUser';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css'],
})
export class PeoplePageComponent implements OnInit {

  constructor(private userDataService: UserDataService) {}

  users: IUser[] = [];

  ngOnInit(): void {
    this.userDataService.getUsers().subscribe({
      next: (result: IUser[]) => this.users = result,
      error: (error: Error) => console.log(error),
      complete: () => {},
    });
  }
}

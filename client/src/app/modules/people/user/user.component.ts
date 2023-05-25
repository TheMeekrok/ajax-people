import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models/IUser';
import { UserDialog } from './user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openDialog(): void { this.dialog.open(UserDialog, { data: { user: this.user } }); }

  user: IUser = {
    firstName: 'Артём',
    lastName: 'Курпас',
    age: 15,
    admissionYear: 2021,
    statusUser: 1,
    educationLevel: 1,
    studyProgramId: 1,
    schoolId: 25,
    idInterests: [1, 2, 3],
  }
}

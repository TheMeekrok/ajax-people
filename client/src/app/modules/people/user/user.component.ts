import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models/IUser';
import { UserDialog } from './user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { IResponseImage } from 'src/app/shared/models/Response';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() user: IUser;
  userStatus: string = '';
  avatarBytes: string;

  constructor(public dialog: MatDialog, private userDataService: UserDataService) {}

  ngOnInit(): void {
    if (this.user.statusUserId) {
      this.userStatus = this.userDataService.userStatusFromId(this.user.statusUserId);
    }

    // if (this.user.avatarPath) {
    //   this.userDataService.
    // }
  }

  showAllData(): void { this.dialog.open(UserDialog, { 
    width: '450px', 
    data: { 
      user: this.user, 
      userStatus: this.userStatus 
    } 
  }); 
  }
}

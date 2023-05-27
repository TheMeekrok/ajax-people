import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/models/IUser';
import { UserDialog } from './user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() user: IUser;
  userStatus: string = '';
  avatarBase: string = 'data:image/png;base64,';
  avatarPath: string = '../../../../assets/user/default_avatar.svg';

  constructor(public dialog: MatDialog, private userDataService: UserDataService) {}

  ngOnInit(): void {
    if (this.user.statusUserId) {
      this.userStatus = this.userDataService.userStatusFromId(this.user.statusUserId);
    }

    this._tryGetAvatar(this.user.id);
  }

  private _tryGetAvatar(userId: number | undefined) {
    if (!userId) return;
    this.userDataService.getUserAvatar(userId).subscribe({
      next: (response: string) => { 
        if (response !== 'no image') this.avatarPath = this.avatarBase + response; 
      },
    })
  }

  showAllData(): void { this.dialog.open(UserDialog, { 
    width: '450px', 
    data: { 
      user: this.user, 
      userStatus: this.userStatus,
      avatarPath: this.avatarPath,
    } 
  }); 
  }
}

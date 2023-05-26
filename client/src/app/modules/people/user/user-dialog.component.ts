import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { IFaculty } from "src/app/shared/models/Faculty";
import { IUser } from "src/app/shared/models/IUser";
import { IInterest } from "src/app/shared/models/Interest";
import { ISchool } from "src/app/shared/models/School";
import { UserDataService } from "src/app/shared/services/user-data.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Observable, forkJoin } from "rxjs";

export interface IDialogData {
  user: IUser,
  avatarPath: string;
  userStatus: string,
  educationLevel: string,
  faculty: string,
  school: string,
  interests: string[],
}

@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatCardModule, 
    MatDividerModule, 
    MatButtonModule, 
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
})
export class UserDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserDialog>,
    private userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {}

  loading: boolean = false;

  ngOnInit(): void { this._initUserData(); }

  private _initUserData() {
    this.data.educationLevel = '';
    this.data.faculty = '';
    this.data.school = '';
    this.data.interests = [];

    if (this.data.user.educationLevelId) {
      this.data.educationLevel = this.userDataService.educationLevelFromId(this.data.user.educationLevelId);
    } 

    if (this.data.user.studyProgramId) {
      this.userDataService.getFacultyById(this.data.user?.studyProgramId)
        .subscribe({ next: (result: IFaculty[]) => this.data.faculty = result[0]?.title });
    }

    if (this.data.user.schoolId) {
      this.userDataService.getSchoolById(this.data.user.schoolId)
        .subscribe({ next: (result: ISchool[]) => this.data.school = result[0]?.title });
    }

    let interests$: Observable<IInterest[]>[] = []
    if (this.data.user.interests) {
      this.data.user.interests
        .forEach(interestId => interests$.push(this.userDataService.getInterestById(interestId)));
    }

    this.loading = true;
    forkJoin(interests$).subscribe({ 
      next: (result) => result.forEach(element => this.data.interests.push(element?.[0]?.title)),
      complete: () => this.loading = false,
    });
  }

  onCloseClick(): void { this.dialogRef.close(); }
}
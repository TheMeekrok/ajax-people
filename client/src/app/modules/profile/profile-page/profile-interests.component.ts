import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/models/IUser';
import { IInterest } from 'src/app/shared/models/Interest';
import { RegisterService } from 'src/app/shared/services/register.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

interface IInterestWithSelect extends IInterest {
  selected?: boolean;
}

@Component({
  selector: 'app-profile-interests',
  templateUrl: './profile-interests.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfileInterestsComponent implements OnInit {

  @Input() user: IUser;
  @Output() triggerPageUpdate = new EventEmitter();

  isLoading: boolean;
  formErrorMessage: string;
  form: FormGroup;

  interests: IInterestWithSelect[] = [];

  constructor(
    private userDataService: UserDataService,
    private registerService: RegisterService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initInterests();
  }

  private initForm() {
    this.form = new FormGroup({
      interestsChips: new FormControl([], Validators.required),
    })
  }

  private initInterests() {
    this.isLoading = true;

    this.userDataService.getInterests().subscribe({
      next: (interests) => this.interests = interests,
      error: (error) => {
        this.formErrorMessage = error.message;
        this.isLoading = false;
      },
      complete: () => {
        this.formErrorMessage = '';
        this.isLoading = false;
        this.showUserInterests(this.user, this.interests);
      }
    });
  }

  private showUserInterests(user: IUser, interests: IInterestWithSelect[]): void {
    if (!user.interests) {
      return;
    }

    user.interests.forEach(interestId => {
      interests[interests.findIndex(element => element.id === interestId)].selected = true;
    })
  }

  get interestsChips() { return this.form.get('interestsChips') }

  proceed() {
    if (!this.user.id) {
      return;
    }
    const userData: IUser = { interests: this.selectInterests() }

    this.isLoading = true;

    this.registerService.updateUserData(userData, this.user.id).subscribe({
      error: (error: Error) => this.formErrorMessage = error.message,
      complete: () => {
        this.formErrorMessage = '';
        this.isLoading = false;
        this.triggerPageUpdate.emit();
      },
    });
  }

  private selectInterests(): number[] {
    const interestsIds: number[] = [];

    this.interestsChips?.value.forEach((chip: IInterestWithSelect) => {
      interestsIds.push(chip.id);
    });
    return interestsIds;
  }
}

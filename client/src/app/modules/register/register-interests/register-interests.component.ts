import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/models/IUser';
import { IInterest } from 'src/app/shared/models/Interest';
import { RegisterService } from 'src/app/shared/services/register.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';

@Component({
  selector: 'app-register-interests',
  templateUrl: './register-interests.component.html',
  styleUrls: ['../register.component.css']
})
export class RegisterInterestsComponent implements OnInit {

  @Input() userId = 0;

  isLoading: boolean = false;
  formErrorMessage: string = '';
  form: FormGroup;

  interests: IInterest[] = [];

  constructor(
    private userDataService: UserDataService,
    private registerService: RegisterService,
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._initInterests();
  }

  proceed() {
    this._updateData();
  }

  private _initForm() {
    this.form = new FormGroup({
      interestsChips: new FormControl(new Array(), [Validators.required]),
    })
  }

  private _initInterests() {
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
      }
    });
  }

  get interestsChips() { return this.form.get('interestsChips') };
  get interestsChipsErrorMessage(): string {
    let errors = this.interestsChips?.errors;
    if (errors?.['required']) { return 'Выберите хотя бы один Интерес'; }
    return '';
  }

  private _selectInterests() {
    let interestsIds: number[] = [];

    this.interestsChips?.value.forEach((chip: string) => {
      let id = this.interests.find(element => element.title === chip)?.id;
      if (id) interestsIds.push(id);
    });

    return interestsIds;
  }

  private _updateData() {
    let userData: IUser = { idInterests: this._selectInterests() }

    this.isLoading = true;

    this.registerService.updateUserData(userData, this.userId).subscribe({
      error: (error: Error) => this.formErrorMessage = error.message,
      complete: () => { 
        this.formErrorMessage = ''; 
        this.isLoading = false;
      },
    });
  }

}

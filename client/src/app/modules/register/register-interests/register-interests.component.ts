import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onInterestsComplete = new EventEmitter();

  isLoading = false;
  formErrorMessage = '';
  form: FormGroup;

  interests: IInterest[] = [];

  constructor(
    private userDataService: UserDataService,
    private registerService: RegisterService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initInterests();
  }

  proceed() {
    this.updateData();
  }

  private initForm() {
    this.form = new FormGroup({
      interestsChips: new FormControl([], [
        Validators.required,
        Validators.maxLength(10),
      ]),
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
      }
    });
  }

  get interestsChips() { return this.form.get('interestsChips') }
  get interestsChipsErrorMessage(): string {
    const errors = this.interestsChips?.errors;

    if (errors?.['required']) { 
      return 'Выберите хотя бы один Интерес'; 
    }
    if (errors?.['maxlength']) { 
      return 'Не более 10'; 
    }

    return '';
  }

  private selectInterests() {
    const interestsIds: number[] = [];

    this.interestsChips?.value.forEach((chip: string) => {
      const id = this.interests.find(element => element.title === chip)?.id;
      if (id) interestsIds.push(id);
    });

    return interestsIds;
  }

  private updateData() {
    const userData: IUser = { 
      interests: this.selectInterests() 
    };

    this.isLoading = true;

    this.registerService.updateUserData(userData, this.userId).subscribe({
      error: (error: Error) => this.formErrorMessage = error.message,
      complete: () => { 
        this.formErrorMessage = ''; 
        this.isLoading = false;
        this.onInterestsComplete.emit();
      },
    });
  }

}

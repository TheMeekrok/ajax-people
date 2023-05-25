import { Component, OnInit } from '@angular/core';

enum RegisterState {
  RegisterUser,
  RegisterProfileInfo,
  RegisterInterests,
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register.component.css']
})
export class RegisterComponent implements OnInit {
  isRegisterUserVisible: boolean = true;
  userId: number;
  registerState: RegisterState;

  ngOnInit(): void {
      this.registerState = RegisterState.RegisterUser;
  }

  onRegisterSuccess(userId: number) {
    this.userId = userId;
    this.registerState = RegisterState.RegisterInterests;
  }
}

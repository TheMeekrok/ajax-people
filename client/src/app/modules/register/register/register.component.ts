import { Component, OnInit } from '@angular/core';

enum RegisterState {
  REGISTER_USER,
  REGISTER_PROFILE_INFO,
  REGISTER_INTERESTS,
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../register.component.css']
})
export class RegisterComponent implements OnInit {

  RegisterState = RegisterState;

  userId: number;
  registerState: RegisterState;

  ngOnInit(): void {
      this.registerState = RegisterState.REGISTER_USER;
  }

  onRegisterSuccess(userId: number) {
    this.userId = userId;
    this.registerState = RegisterState.REGISTER_PROFILE_INFO;
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  RegisterState = RegisterState;

  userId: number;
  registerState: RegisterState;
  canDeactivate = true;

  ngOnInit(): void {
      this.registerState = RegisterState.REGISTER_USER;
  }

  onRegisterSuccess(userId: number): void {
    this.userId = userId;
    this.canDeactivate = false;
    this.registerState = RegisterState.REGISTER_PROFILE_INFO;
  }

  onUserDataComplete(): void {
    this.registerState = RegisterState.REGISTER_INTERESTS;
  }

  onInterestsComplete(): void {
    this.canDeactivate = true;
    this.router.navigate(['/people']);
  }
}

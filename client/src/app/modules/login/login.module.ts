import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    LoginRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class LoginModule {}

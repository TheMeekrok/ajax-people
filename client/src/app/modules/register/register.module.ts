import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { RegisterUserModal } from './register-user/register-user-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterProfileInfoComponent } from './register-profile-info/register-profile-info.component';
import { RegisterComponent } from './register/register.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterInterestsComponent } from './register-interests/register-interests.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../header/header/header.component';
import { FooterModule } from '../footer/footer.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [
    RegisterUserComponent,
    RegisterProfileInfoComponent,
    RegisterComponent,
    RegisterUserModal,
    RegisterInterestsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RegisterRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    FooterModule,
    HeaderModule,
  ],
  providers: [
    MatDialog,
  ]
})
export class RegisterModule { }

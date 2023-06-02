import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent} from "./profile-page/profile-page.component";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ProfileInterestsComponent } from './profile-page/profile-interests.component';


@NgModule({
  declarations: [
    ProfilePageComponent,
    UploadFileComponent,
    ProfileInterestsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgxMatFileInputModule,
    MatIconModule,
  ],
})
export class ProfileModule { }

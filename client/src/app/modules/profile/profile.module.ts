import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent} from "./profile-page/profile-page.component";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMatFileInputModule,
    MatIconModule
  ],
})
export class ProfileModule { }

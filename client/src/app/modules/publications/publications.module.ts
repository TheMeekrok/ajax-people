import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationsRoutingModule } from './publications-routing.module';
import { PublicationsPageComponent} from "./publications-page/publications-page.component";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {PostModule} from "../post/post.module";


@NgModule({
  declarations: [
    PublicationsPageComponent,
  ],
  imports: [
    CommonModule,
    PublicationsRoutingModule,
    PostModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class PublicationsModule { }

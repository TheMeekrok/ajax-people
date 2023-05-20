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
import {CreatePostComponent} from "./create-post/create-post.component";
import {MatChipsModule} from "@angular/material/chips";


@NgModule({
  declarations: [
    PublicationsPageComponent,
    CreatePostComponent
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
    ReactiveFormsModule,
    MatChipsModule
  ]
})
export class PublicationsModule { }

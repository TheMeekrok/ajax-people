import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent} from "./post/post.component";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CreatePostComponent} from "../publications/create-post/create-post.component";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import localeRu from '@angular/common/locales/ru';
import {FullPostComponent} from "./full-post/full-post.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    PostComponent,
    FullPostComponent
  ],
  exports: [
    PostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }
  ]
})
export class PostModule { }

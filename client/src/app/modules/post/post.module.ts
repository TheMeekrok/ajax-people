import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent} from "./post/post.component";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CreatePostComponent} from "../publications/create-post/create-post.component";


@NgModule({
  declarations: [
    PostComponent,
    CreatePostComponent
  ],
  exports: [
    PostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class PostModule { }

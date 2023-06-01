import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TagsPageComponent } from './tags-page/tags-page.component';
import { MatCardModule } from "@angular/material/card";
import { TagComponent } from './tag/tag.component';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { SuccessCreateTagComponent } from './success-create-tag/success-create-tag.component';
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmationDeleteTagComponent } from './confirmation-delete-tag/confirmation-delete-tag.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { UnmoderatedPostComponent } from "./unmoderated-post/unmoderated-post.component";
import { UnmoderatedPostsComponent } from "./unmoderated-posts/unmoderated-posts.component";
import { PublicationsModule } from "../publications/publications.module";


@NgModule({
  declarations: [
    TagsPageComponent,
    TagComponent,
    SuccessCreateTagComponent,
    ConfirmationDeleteTagComponent,
    AdminPageComponent,
    UnmoderatedPostsComponent,
    UnmoderatedPostComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    PublicationsModule,
  ]
})
export class AdminModule { }

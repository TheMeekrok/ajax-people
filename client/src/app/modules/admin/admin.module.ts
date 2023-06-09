import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TagsPageComponent } from './tags-page/tags-page.component';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { UnmoderatedPostsComponent } from "./unmoderated-posts/unmoderated-posts.component";
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { InterestsComponent } from './interests/interests.component';


@NgModule({
  declarations: [
    TagsPageComponent,
    UnmoderatedPostsComponent,
    AdminUsersComponent,
    AdminPageComponent,
    InterestsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ]
})
export class AdminModule { }

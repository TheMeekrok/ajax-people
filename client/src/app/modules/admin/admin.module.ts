import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { TagsPageComponent } from './tags-page/tags-page.component';
import { MatCardModule } from "@angular/material/card";
import { TagComponent } from './tag/tag.component';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuccessCreateTagComponent } from './success-create-tag/success-create-tag.component';
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmationDeleteTagComponent } from './confirmation-delete-tag/confirmation-delete-tag.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { UnmoderatedPostsComponent } from "./unmoderated-posts/unmoderated-posts.component";
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminMesageModalComponent } from './admin-mesage-modal/admin-mesage-modal.component';


@NgModule({
  declarations: [
    TagsPageComponent,
    TagComponent,
    SuccessCreateTagComponent,
    ConfirmationDeleteTagComponent,
    UnmoderatedPostsComponent,
    AdminUsersComponent,
    AdminPageComponent,
    AdminMesageModalComponent,
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
  ]
})
export class AdminModule { }

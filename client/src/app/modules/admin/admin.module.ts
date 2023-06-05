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
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { UnmoderatedPostsComponent } from "./unmoderated-posts/unmoderated-posts.component";
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AppModule } from "../../app.module";
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
    AdminMesageModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    AppModule
  ]
})
export class AdminModule { }

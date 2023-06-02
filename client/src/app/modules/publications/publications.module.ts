import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationsRoutingModule } from './publications-routing.module';
import { PublicationsPageComponent } from "./publications-page/publications-page.component";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { CreatePostComponent } from "./create-post/create-post.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSidenavModule } from "@angular/material/sidenav";
import { PostComponent } from "./post/post.component";
import { MatListModule } from "@angular/material/list";
import { FullPostComponent } from "./full-post/full-post.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PeopleModule } from '../people/people.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        PostComponent,
        CreatePostComponent,
        PublicationsPageComponent,
        FullPostComponent
    ],
    exports: [
        PostComponent
    ],
    imports: [
        CommonModule,
        PublicationsRoutingModule,
        PeopleModule,
        MatInputModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ]
})
export class PublicationsModule { }

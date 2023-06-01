import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomePageLayoutComponent } from './shared/layouts/home-page-layout/home-page-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FooterModule } from './modules/footer/footer.module';
import { HeaderModule } from './modules/header/header.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from "@angular/material/paginator";
import { registerLocaleData } from "@angular/common";
import { LoginModule } from './modules/login/login.module';
import localeRu from "@angular/common/locales/ru";
import { SuccessPostComponent } from './modules/publications/success-post/success-post.component';
import { MatButtonModule } from "@angular/material/button";
import { NotFoundComponent } from './components/not-found/not-found.component';


registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    HomePageLayoutComponent,
    MainLayoutComponent,
    SuccessPostComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HeaderModule,
    FooterModule,
    MatDialogModule,
    MatSidenavModule,
    MatPaginatorModule,
    LoginModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageLayoutComponent } from "./shared/layouts/home-page-layout/home-page-layout.component";
import { MainLayoutComponent } from "./shared/layouts/main-layout/main-layout.component";
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RegisterGuard } from './shared/guards/register.guard';
import { InfoComponent } from './components/info/info.component';
import { AuthorsComponent } from './components/authors/authors.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageLayoutComponent,
  },
  {
    path: 'sign-up', 
    pathMatch: 'full', 
    loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: '', component: MainLayoutComponent, children: [
      {
        path: 'people',
        canActivate: [AuthGuard],
        pathMatch: 'full',
        loadChildren: () => import('./modules/people/people.module')
          .then(m => m.PeopleModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        pathMatch: 'full',
        loadChildren: () => import('./modules/profile/profile.module')
          .then(m => m.ProfileModule)
      },
      {
        path: 'posts',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/publications/publications.module')
          .then(m => m.PublicationsModule)
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/admin/admin.module')
          .then(m => m.AdminModule)
      },
      {
        path: 'info',
        component: InfoComponent,
      },
      {
        path: 'authors',
        component: AuthorsComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageLayoutComponent } from "./shared/layouts/home-page-layout/home-page-layout.component";
import { MainLayoutComponent } from "./shared/layouts/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home', component: HomePageLayoutComponent,
  },
  {
    path: '', component: MainLayoutComponent, children: [
      {
        path: 'sign-up',
        pathMatch: 'full',
        loadChildren: () => import('./modules/register/register.module')
          .then(m => m.RegisterModule)
      },
      {
        path: 'people',
        pathMatch: 'full',
        loadChildren: () => import('./modules/people/people.module')
          .then(m => m.PeopleModule)
      },
      {
        path: 'profile/:id',
        pathMatch: 'full',
        loadChildren: () => import('./modules/profile/profile.module')
          .then(m => m.ProfileModule)
      },
      {
        path: 'posts',
        loadChildren: () => import('./modules/publications/publications.module')
          .then(m => m.PublicationsModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module')
          .then(m => m.AdminModule)
      },
    ]
  },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

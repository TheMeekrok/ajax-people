import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from "./shared/layouts/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./shared/layouts/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        pathMatch: 'full',
        loadChildren: () => import("./modules/login/login.module").then(m => m.LoginModule)
      },
    ],
  },
  {
    path: 'main', component: MainLayoutComponent, children: [
      {
        path: 'sign-up',
        pathMatch: 'full',
        loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule)
      },
      {
        path: 'people',
        pathMatch: 'full',
        loadChildren: () => import('./modules/people/people.module').then(m => m.PeopleModule)
      },
      {
        path: 'profile/:id',
        pathMatch: 'full',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'subscriptions',
        loadChildren: () => import('./modules/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule)
      },
      {
        path: 'publications',
        loadChildren: () => import('./modules/publications/publications.module').then(m => m.PublicationsModule)
      },
    ]
  },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

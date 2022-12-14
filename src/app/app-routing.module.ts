import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Page404Component} from "./views/pages/page404/page404.component";
import {Page500Component} from "./views/pages/page500/page500.component";
import {LoginComponent} from "./views/pages/login/login.component";
import {RegisterComponent} from "./views/pages/register/register.component";
import {AuthGuardService} from "./service/authGuardService";
import {DefaultLayoutComponent} from "./layouts/default-layout/default-layout.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    title : 'Home',
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./views/profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'manage',
        loadChildren: () =>
          import('./views/manage/manage.module').then((m) => m.ManageModule)
      },
      {
        path: 'import',
        loadChildren: () =>
          import('./views/order-import/order-import.module').then((m) => m.OrderImportModule)
      },
      {
        path: '404',
        component: Page404Component,
        title: 'Page 404'
      },
      {
        path: '500',
        component: Page500Component,
        title: 'Page 500'
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [AuthGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

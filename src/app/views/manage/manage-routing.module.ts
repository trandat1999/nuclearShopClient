import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: "users",
    component: UserComponent
  },
  {
    path: "roles",
    component: RoleComponent
  },
  {
    path: 'category',
    component : CategoryComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
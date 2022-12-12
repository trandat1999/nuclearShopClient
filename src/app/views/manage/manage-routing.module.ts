import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from "./user/user.component";
import {RoleComponent} from "./role/role.component";
import { CategoryComponent } from './category/category.component';
import {AdministrativeUnitComponent} from "./administrative-unit/administrative-unit.component";

const routes: Routes = [
  {
    path: "users",
    component: UserComponent,
    title: "Manage | User"
  },
  {
    path: "roles",
    component: RoleComponent,
    title: "Manage | Role"
  },
  {
    path: 'category',
    component : CategoryComponent,
    title: "Manage | Category"
  },
  {
    path: 'administrative-unit',
    component : AdministrativeUnitComponent,
    title: "Manage | Administrative Unit"
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import {UserComponent, UserModalCreateComponent} from './user/user.component';
import { RoleComponent } from './role/role.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryComponent, CategoryDialogDeleteConfirm, DialogCreate} from "./category/category.component";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";


@NgModule({
  declarations: [
    UserComponent,
    RoleComponent,
    UserModalCreateComponent,
    CategoryComponent,
    CategoryDialogDeleteConfirm,
    DialogCreate
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    MaterialModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule
  ]
})
export class ManageModule { }

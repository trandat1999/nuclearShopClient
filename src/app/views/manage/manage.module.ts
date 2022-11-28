import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import {UserComponent, UserModalCreateComponent} from './user/user.component';
import { RoleComponent } from './role/role.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    UserComponent,
    RoleComponent,
    UserModalCreateComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    MaterialModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ManageModule { }

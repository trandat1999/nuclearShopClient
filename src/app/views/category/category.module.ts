import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryComponent, CategoryDialogDeleteConfirm, DialogCreate} from './category.component';
import {CategoryRoutingModule} from "./category-routing.module";
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MaterialExtensionsModule} from "../../material-extensions.module";
import {MtxFormGroupModule} from "@ng-matero/extensions/form-group";

@NgModule({
  declarations: [
    CategoryComponent,DialogCreate,CategoryDialogDeleteConfirm
  ],
  imports: [
    CommonModule, CategoryRoutingModule, MaterialModule, TranslateModule, FormsModule, ReactiveFormsModule, NgxMatSelectSearchModule, MaterialExtensionsModule, MtxFormGroupModule
  ]
})
export class CategoryModule { }

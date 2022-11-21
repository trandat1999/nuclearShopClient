import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoryComponent, DialogCreate} from './category.component';
import {CategoryRoutingModule} from "./category-routing.module";
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

@NgModule({
  declarations: [
    CategoryComponent,DialogCreate
  ],
    imports: [
        CommonModule, CategoryRoutingModule, MaterialModule, TranslateModule, FormsModule, ReactiveFormsModule, NgxMatSelectSearchModule
    ]
})
export class CategoryModule { }

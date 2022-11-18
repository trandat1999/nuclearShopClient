import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import {CategoryRoutingModule} from "./category-routing.module";
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    CategoryComponent
  ],
    imports: [
        CommonModule, CategoryRoutingModule, MaterialModule, TranslateModule
    ]
})
export class CategoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderImportRoutingModule } from './order-import-routing.module';
import { PublisherComponent } from './publisher/publisher.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialExtensionsModule} from "../../material-extensions.module";
import {DialogCreatePublisher} from "./publisher/dialog-create-publisher.component";


@NgModule({
  declarations: [
    PublisherComponent,
    DialogCreatePublisher
  ],
  imports: [
    CommonModule,
    OrderImportRoutingModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    MaterialExtensionsModule,
    ReactiveFormsModule
  ]
})
export class OrderImportModule { }

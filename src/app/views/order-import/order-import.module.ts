import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderImportRoutingModule } from './order-import-routing.module';
import { PublisherComponent } from './publisher/publisher.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialExtensionsModule} from "../../material-extensions.module";
import {DialogCreatePublisher} from "./publisher/dialog-create-publisher.component";
import { OrderImportComponent } from './order-import/order-import.component';
import { OrderImportEditComponent } from './order-import-edit/order-import-edit.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {MtxDatetimepickerModule} from "@ng-matero/extensions/datetimepicker";
import {NumberDirective} from "../../components/number-input.directive";


@NgModule({
  declarations: [
    PublisherComponent,
    DialogCreatePublisher,
    OrderImportComponent,
    OrderImportEditComponent,
    NumberDirective
  ],
    imports: [
        CommonModule,
        OrderImportRoutingModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        MaterialExtensionsModule,
        ReactiveFormsModule,
        NgSelectModule,
        MtxDatetimepickerModule
    ]
})
export class OrderImportModule { }

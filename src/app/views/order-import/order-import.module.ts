import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderImportRoutingModule } from './order-import-routing.module';
import { PublisherComponent } from './publisher/publisher.component';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogCreatePublisher} from "./publisher/dialog-create-publisher.component";
import { OrderImportComponent } from './order-import/order-import.component';
import { OrderImportEditComponent } from './order-import-edit/order-import-edit.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {MtxDatetimepickerModule} from "@ng-matero/extensions/datetimepicker";
import {NumberDirective} from "../../directives/number-input.directive";
import {NgxMaskModule} from "ngx-mask";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MtxSelectModule} from "@ng-matero/extensions/select";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MtxGridModule} from "@ng-matero/extensions/grid";
import {MatPaginatorModule} from "@angular/material/paginator";


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
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MtxDatetimepickerModule,
    NgxMaskModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    MtxSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MtxGridModule,
    MatPaginatorModule,
  ],
})
export class OrderImportModule { }

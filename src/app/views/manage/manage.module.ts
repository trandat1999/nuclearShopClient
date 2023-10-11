import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import {UserComponent, UserModalCreateComponent} from './user/user.component';
import { RoleComponent } from './role/role.component';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryComponent, CategoryDialogDeleteConfirm, DialogCreate} from "./category/category.component";
import { AdministrativeUnitComponent } from './administrative-unit/administrative-unit.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {DialogCreateProduct, ProductComponent} from './product/product.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import {DialogCreateWarehouse} from "./warehouse/dialog-create-warehouse.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MtxSelectModule} from "@ng-matero/extensions/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MtxGridModule} from "@ng-matero/extensions/grid";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    UserComponent,
    RoleComponent,
    UserModalCreateComponent,
    CategoryComponent,
    CategoryDialogDeleteConfirm,
    DialogCreate,
    AdministrativeUnitComponent,
    ProductComponent,
    DialogCreateProduct,
    WarehouseComponent,
    DialogCreateWarehouse
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    MtxSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatTooltipModule,
    MtxGridModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTableModule,
  ]
})
export class ManageModule { }

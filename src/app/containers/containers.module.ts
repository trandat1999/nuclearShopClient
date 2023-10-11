import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UploadExcelDialogComponent} from "./upload-excel-dialog/upload-excel-dialog.component";
import {ConfirmDeleteComponent} from "./confirm-delete/confirm-delete.component";
import {CommonInputComponent} from './common-input/common-input.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NuclearInputComponent } from './nuclear-input/nuclear-input.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
@NgModule({
    declarations: [
        UploadExcelDialogComponent,
        ConfirmDeleteComponent,
        CommonInputComponent,
        BreadcrumbsComponent,
        NuclearInputComponent
    ],
  exports: [
    BreadcrumbsComponent,
    CommonInputComponent,
    NuclearInputComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    MatButtonModule,
    MatDatepickerModule
  ]
})
export class ContainersModule { }

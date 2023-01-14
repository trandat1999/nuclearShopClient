import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PublisherComponent} from "./publisher/publisher.component";
import {OrderImportComponent} from "./order-import/order-import.component";
import {OrderImportEditComponent} from "./order-import-edit/order-import-edit.component";

const routes: Routes = [
  {
    path: "publisher",
    component: PublisherComponent,
    title: "Manage | Publisher"
  },
  {
    path: "order-import",
    component: OrderImportComponent,
    title: "Manage | Import Order"
  },
  {
    path: "order-import-edit/:id",
    component: OrderImportEditComponent,
    title: "Manage | Edit Import Order",
  },
  {
    path: "order-import-edit",
    component: OrderImportEditComponent,
    title: "Manage | New Import Order",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderImportRoutingModule { }

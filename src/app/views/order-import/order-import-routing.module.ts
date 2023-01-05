import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PublisherComponent} from "./publisher/publisher.component";

const routes: Routes = [
  {
    path: "publisher",
    component: PublisherComponent,
    title: "Manage | Publisher"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderImportRoutingModule { }

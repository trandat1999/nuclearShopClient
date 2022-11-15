import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {RouterOutlet} from "@angular/router";
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import {MaterialModule} from "../material-module";
import { DefaultSidenavComponent } from './default-sidenav/default-sidenav.component';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";



@NgModule({
  declarations: [
    DefaultLayoutComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultSidenavComponent
  ],
    imports: [
        CommonModule,
        RouterOutlet,
        MaterialModule,
        PerfectScrollbarModule
    ]
})
export class NuclearLayoutsModule { }

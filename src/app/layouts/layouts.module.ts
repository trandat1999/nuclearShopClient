import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import {MaterialModule} from "../material-module";
import { DefaultSidenavComponent } from './default-sidenav/default-sidenav.component';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {GridModule} from "@coreui/angular";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {NgHttpLoaderModule} from "ng-http-loader";



@NgModule({
  declarations: [
    DefaultLayoutComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultSidenavComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        PerfectScrollbarModule,
        RouterModule,
        GridModule,
        FontAwesomeModule,
        NgbDropdownModule,
        NgHttpLoaderModule
    ]
})
export class NuclearLayoutsModule { }

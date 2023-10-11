import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { DefaultSidenavComponent } from './default-sidenav/default-sidenav.component';
import {NgHttpLoaderModule} from "ng-http-loader";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    DefaultLayoutComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultSidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgHttpLoaderModule,
    FormsModule,
    TranslateModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class NuclearLayoutsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SettingComponent } from './setting/setting.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    TranslateModule
  ]
})
export class ProfileModule { }

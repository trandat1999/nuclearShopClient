import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SettingComponent } from './setting/setting.component';
import {MaterialModule} from "../../material-module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialExtensionsModule} from "../../material-extensions.module";

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialExtensionsModule
  ]
})
export class ProfileModule { }

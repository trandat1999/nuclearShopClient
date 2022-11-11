import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PagesModule} from "./views/pages/pages.module";
import {authInterceptorProviders} from "./helpers/auth.interceptor";
import {HttpClientModule} from "@angular/common/http";
import {JWT_OPTIONS, JwtModule} from "@auth0/angular-jwt";
import {StorageService} from './service/storage.service';
import {AppSettings} from "../../AppSettings";
import {AuthGuardService} from "./service/authGuardService";
import {MaterialModule} from "./material-module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastContainer} from "./containers/toast-container.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function jwtOptionsFactory(storageService: StorageService){
  return {
    tokenGetter : () =>{
      return storageService.getAccessToken();
    },
    allowedDomains: ["localhost:8080"],
    disallowedRoutes: [ AppSettings.API_ENDPOINT+":"+AppSettings.PORT+"/api/auth/**",
      AppSettings.API_ENDPOINT+":"+AppSettings.PORT+"/api/v1/publish/**"]
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ToastContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider:{
        provide: JWT_OPTIONS,
        useFactory :jwtOptionsFactory,
        deps : [StorageService]
      }
    }),
    MaterialModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [authInterceptorProviders,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

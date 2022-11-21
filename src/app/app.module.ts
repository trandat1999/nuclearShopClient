import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PagesModule} from "./views/pages/pages.module";
import {authInterceptorProviders} from "./helpers/auth.interceptor";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {JWT_OPTIONS, JwtModule} from "@auth0/angular-jwt";
import {StorageService} from './service/storage.service';
import {AppSettings} from "../../AppSettings";
import {AuthGuardService} from "./service/authGuardService";
import {MaterialModule} from "./material-module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastContainer} from "./containers/toast-container.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NuclearLayoutsModule} from "./layouts/layouts.module";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CustomMatPaginator} from "./components/CustomMatPage";
import {NgHttpLoaderModule} from "ng-http-loader";
import {NgxSpinnerModule} from "ngx-spinner";
import {color} from "chart.js/types/helpers";
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

export function rootLoaderI18n(http: HttpClient){
  return new TranslateHttpLoader(http,"assets/i18n/",".json");
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent,
    ToastContainer,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [StorageService]
      }
    }),
    MaterialModule,
    NgbModule,
    FontAwesomeModule,
    NuclearLayoutsModule,
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: rootLoaderI18n,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule.forRoot({
      type : "square-jelly-box"
      }
    )
  ],
  providers: [authInterceptorProviders,AuthGuardService,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
  },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginator
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

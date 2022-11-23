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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NuclearLayoutsModule} from "./layouts/layouts.module";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CustomMatPaginator} from "./components/CustomMatPage";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {ToastrModule} from "ngx-toastr";
import {A} from "@angular/cdk/keycodes";
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
    ),
    NgxMatSelectSearchModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      closeButton : true,
      progressBar : true,
      progressAnimation : "decreasing",
      enableHtml : true,
      tapToDismiss : true,
    })
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

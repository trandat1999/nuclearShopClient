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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NuclearLayoutsModule} from "./layouts/layouts.module";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CustomMatPaginator} from "./components/CustomMatPage";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {ToastrModule} from "ngx-toastr";
import {MaterialExtensionsModule} from "./material-extensions.module";
import {MAT_DATE_FORMATS, MatNativeDateModule} from "@angular/material/core";
import {ConfirmDeleteComponent} from './containers/confirm-delete/confirm-delete.component';
import {WebSocketService} from "./service/web-socket.service";
import {NgScrollbarModule} from "ngx-scrollbar";
import {MTX_DATETIME_FORMATS, MtxNativeDatetimeModule} from "@ng-matero/extensions/core";
import {MtxMomentDatetimeModule} from "@ng-matero/extensions-moment-adapter";
import {MtxLuxonDatetimeModule} from "@ng-matero/extensions-luxon-adapter";
import {UploadExcelDialogComponent} from "./containers/upload-excel-dialog/upload-excel-dialog.component";
import {IConfig, NgxMaskModule} from "ngx-mask";

export function jwtOptionsFactory(storageService: StorageService) {
  return {
    tokenGetter: () => {
      return storageService.getAccessToken();
    },
    allowedDomains: ["localhost:8080"],
    disallowedRoutes: [AppSettings.API_ENDPOINT + ":" + AppSettings.PORT + "/api/auth/**",
      AppSettings.API_ENDPOINT + ":" + AppSettings.PORT + "/api/v1/publish/**"]
  }
}

export function rootLoaderI18n(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
const date_format_mtx = {
  parse: {
    dateInput: 'ddMMyyyy',
    monthInput: 'MMMM',
    yearInput: 'yyyy',
    timeInput: 'HHmm',
    datetimeInput: 'ddMMyyyyHHmm',
  },
  display: {
    dateInput: 'dd-MM-yyyy',
    monthInput: 'MMMM',
    yearInput: 'yyyy',
    timeInput: 'HH:mm',
    datetimeInput: 'dd-MM-yyyy HH:mm',
    monthLabel: "MMMM",
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
    popupHeaderDateLabel: 'dd MMMM yyyy',
  },
};
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteComponent,
    UploadExcelDialogComponent
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
    MaterialExtensionsModule,
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
        type: "ball-spin-clockwise"
      }
    ),
    NgxMatSelectSearchModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      progressAnimation: "decreasing",
      enableHtml: true,
      tapToDismiss: true,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    MtxNativeDatetimeModule,
    MtxMomentDatetimeModule,
    MtxLuxonDatetimeModule,
    NgxMaskModule.forRoot(maskConfig),
    // MtxDateFnsDatetimeModule
  ],
  providers: [authInterceptorProviders, AuthGuardService, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
  },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginator
    }, WebSocketService,
    {
      provide: MTX_DATETIME_FORMATS,
      useValue: date_format_mtx
    },
    {provide: MAT_DATE_FORMATS, useValue: date_format_mtx},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AppSettings} from "../../../AppSettings";
import {catchError, Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/files";
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private translate: TranslateService) {
  }

  upload(file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/files", formData).pipe(
      map((data) => {
        return data;
      }),
      catchError((error) => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../../../AppSettings";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import {map} from "rxjs/operators";
import {catchError, of} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import { BaseResponse } from 'src/app/dto/BaseResponse';

@Injectable({
  providedIn: 'root'
})
export class AdminstrativeUnitService {

  constructor(private http : HttpClient,
              private toast : ToastrService,
              private translate : TranslateService) { }

  private readonly baseUrl : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/administrative-units";

  getAllParent(){
    return this.http.get(this.baseUrl+"/all-parent").pipe(
      map(value => {
        let rs = value as BaseResponse;
        return rs.body;
      }),catchError(error => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }

  getPageParent(search : SearchRequest){
    return this.http.post(this.baseUrl+"/page",search).pipe(
      map(value => {
        let rs = value as BaseResponse;
        return rs.body;
      }),catchError(error => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }

  getAllByParent(id : number){
    return this.http.get(this.baseUrl+"/all-by-parent/"+id).pipe(
      map(value => {
        let rs = value as BaseResponse;
        return rs.body;
      }),catchError(error => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }
  importExcel(file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.baseUrl+"/import-excel", formData).pipe(
      map((data) => {
        return data as BaseResponse;
      }),
      catchError((error) => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }
}

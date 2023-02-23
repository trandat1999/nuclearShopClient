import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AppSettings} from "../../../../../AppSettings";
import {map} from "rxjs/operators";
import {BaseResponse} from "../../../dto/BaseResponse";
import {catchError, of} from "rxjs";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import {BaseService} from "../../../service/base.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private base: BaseService,
    private translate: TranslateService) {
  }

  private baseUrl : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/products";

  getAll(){
    return this.base.get(this.baseUrl);
  }

  get(id : number){
    return this.http.get(this.baseUrl+"/"+id).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }

  delete(id : number){
    return this.http.delete(this.baseUrl+"/"+id).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }

  put(id : number,request :any ){
    return this.http.put(this.baseUrl+"/"+id, request).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(false)
      })
    );
  }

  save(request :any){
    return this.http.post(this.baseUrl, request).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error);
      })
    );
  }

  search(search :SearchRequest){
    return this.http.post(this.baseUrl + "/pages", search).pipe(
      map(value => {
        let data = value as BaseResponse;
        return data.body;
      }),catchError(error => {
        this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
        return of(false)
      })
    );
  }
}

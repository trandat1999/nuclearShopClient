import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {map} from "rxjs/operators";
import {BaseResponse} from "../dto/BaseResponse";
import {catchError, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private http : HttpClient,
    private translate : TranslateService,
    private toast : ToastrService) { }
  get(url:string){
    return this.http.get(url).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error?.message? error.error.message : this.translate.instant("common.commonError"),
          this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }
  delete(url: string){
    return this.http.delete(url).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }
  put(url : string,request :any ){
    return this.http.put(url, request).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }

  save(url : string,request :any ){
    return this.http.post(url, request).pipe(
      map(value => {
        return value as BaseResponse;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }
  search(url : string,search :any){
    return this.http.post(url, search).pipe(
      map(value => {
        let data = value as BaseResponse;
        return data.body;
      }),catchError(error => {
        this.toast.error(error?.error.message? error.error.message : this.translate.instant("common.commonError"), this.translate.instant("common.error") +(error?.error?.code? " "+error?.error?.code:""))
        return of(error)
      })
    );
  }
}

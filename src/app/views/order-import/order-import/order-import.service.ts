import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {BaseService} from "../../../service/base.service";
import {AppSettings} from "../../../../../AppSettings";

@Injectable({
  providedIn: 'root'
})
export class OrderImportService {
  constructor(
    private http : HttpClient,
    private translate : TranslateService,
    private toast : ToastrService,
    private base : BaseService) {}
  private baseUrl : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/order-imports";
  get(id : number){
    return this.base.get(this.baseUrl+"/"+id);
  }
  delete(id : number){
    return this.base.delete(this.baseUrl+"/"+id);
  }
  put(id : number,request :any ){
    return this.base.put(this.baseUrl+"/"+id, request);
  }
  save(request :any){
    return this.base.save(this.baseUrl, request);
  }
  search(search :any){
    return this.base.search(this.baseUrl + "/pages", search);
  }
}

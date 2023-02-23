import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {AppSettings} from "../../../../../AppSettings";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import {BaseService} from "../../../service/base.service";

@Injectable({
  providedIn: 'root'
})
export class PublisherService{
  constructor(
    private http : HttpClient,
    private translate : TranslateService,
    private toast : ToastrService,
    private base : BaseService) {}
  private baseUrl : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/suppliers";
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
  search(search :SearchRequest){
    return this.base.search(this.baseUrl + "/pages", search);
  }
  getAll(){
    return this.base.get(this.baseUrl);
  }
}

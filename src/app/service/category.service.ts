import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {catchError, Observable, of} from "rxjs";
import {Category} from "../dto/Category";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {BaseResponse} from "../dto/BaseResponse";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlCategory : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/categories";

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private translate: TranslateService) { }

  getPages(search : any){
    return this.http.post(this.urlCategory+"/search",search);
  }

  saveOrUpdate(category : any){
    return this.http.post(this.urlCategory,category);
  }

  get(id : any){
    return this.http.get(this.urlCategory+"/"+id);
  }

  delete(id : any){
    return this.http.delete(this.urlCategory+"/"+id);
  }

  getAllParent(){
    return this.http.get(this.urlCategory+"/parent");
  }

  getAll(){
    return this.http.get(this.urlCategory).pipe(
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

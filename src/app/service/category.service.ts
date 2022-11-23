import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {Observable} from "rxjs";
import {Category} from "../dto/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlCategory : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/categories";

  constructor(private http: HttpClient) { }

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

}

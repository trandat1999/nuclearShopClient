import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {map} from "rxjs/operators";
import {LoginResponse} from "../dto/AuthRequest.class";
import {catchError, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlCategory : string = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/categories"

  constructor(private http: HttpClient) { }

  getPages(search : any){
    return this.http.post(this.urlCategory+"/search",search);
  }
}

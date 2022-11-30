import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {User} from "../views/manage/user/user.component";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/user";
  constructor(private http : HttpClient) { }

  save(user : User): Observable<any>{
    return this.http.post(this.baseUrl, user);
  }

  update(user : User, userId : number): Observable<any>{
    return this.http.put(this.baseUrl+"/"+userId, user);
  }

  getPages(search : any) {
    return this.http.post(this.baseUrl+"/get-page",search);
  }

  getAllRole(){
    return this.http.get(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/role")
  }

  delete(id : number) : Observable<any>{
    return this.http.delete(this.baseUrl+"/"+id);
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {User} from "../views/manage/user/user.component";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/user";
  constructor(private http : HttpClient) { }

  save(user : User){
    return this.http.post(this.baseUrl, user);
  }

  update(user : User, userId : number){
    return this.http.put(this.baseUrl+"/"+userId, user);
  }

  getPages(search : any) {
    return this.http.post(this.baseUrl+"/get-page",search);
  }

  getAllRole(){
    return this.http.get(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/role")
  }

}

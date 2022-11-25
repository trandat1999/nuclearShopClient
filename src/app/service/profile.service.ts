import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  base_url = AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+ "/api/v1/user"

  constructor(private http : HttpClient) { }

  getProfile(){
    return this.http.get(this.base_url+"/get-profile");
  }

  updateProfile(person: any){
    return this.http.post(this.base_url+"/get-profile",person);
  }
}

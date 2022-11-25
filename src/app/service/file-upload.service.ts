import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppSettings} from "../../../AppSettings";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http : HttpClient) { }

  upload(file: File) : Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', file);
    // const req = new HttpRequest('POST', AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/files", formData);
    return this.http.post(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+"/api/v1/files", formData);
  }

}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {AppSettings} from "../../../AppSettings";
import {LoginRequest, LoginResponse, RegisterRequest} from "../dto/AuthRequest.class";
import {map} from "rxjs/operators";
import {StorageService} from "./storage.service";
import {CurrentUser} from "../dto/AuthResponse";
import {BaseResponse} from "../dto/BaseResponse";

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// }
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}
  login(loginRequest :LoginRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/auth/login", loginRequest)
      .pipe(map(
        (data) =>{
          let loginResponse = data as LoginResponse;
          this.storageService.saveToken(loginResponse);
          return true;
        }
      ),catchError(
        (error) => {
          this.storageService.signOut();
          return of(false);
        }
      ));
  }

  register(registerRequset : RegisterRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/auth/signup", registerRequset);
  }
  refreshToken(username: string|null, refresh: string|null) {
    return this.http.post(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/auth/refresh/token", {
      username: username,refreshToken: refresh
    });
  }

  currentUser() {
    return this.http.get(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT + "/api/v1/user/current")
      .pipe(map(
        (data) =>{
          let baseResponse = data as BaseResponse
          if(baseResponse && baseResponse.code === 200 && baseResponse.body) {
            this.storageService.saveUser(baseResponse.body as CurrentUser);
            return baseResponse.body as CurrentUser;
          }
          return false;
        }
      ),catchError(
        (error) => {
          this.storageService.signOut();
          return of(false);
        }
      ));
  }
}

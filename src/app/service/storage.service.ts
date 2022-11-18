import {Injectable} from '@angular/core';
import {AppSettings} from "../../../AppSettings";
import {LoginResponse} from "../dto/AuthRequest.class";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }
  private jwtHelper = new JwtHelperService()
  signOut(): void {
    localStorage.clear();
  }

  public saveToken(loginResponse: LoginResponse): void {
    localStorage.removeItem(AppSettings.TOKEN_KEY);
    localStorage.removeItem(AppSettings.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AppSettings.USERNAME_KEY);
    localStorage.setItem(AppSettings.TOKEN_KEY,loginResponse.accessToken);
    localStorage.setItem(AppSettings.REFRESH_TOKEN_KEY,loginResponse.refreshToken);
    localStorage.setItem(AppSettings.USERNAME_KEY,loginResponse.username)
  }

  public getToken(): string | null {
    return localStorage.getItem(AppSettings.TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(AppSettings.REFRESH_TOKEN_KEY);
  }

  public getUsername(): string | null {
    return localStorage.getItem(AppSettings.USERNAME_KEY);
  }

  public saveUser(user: any): void {
    localStorage.removeItem(AppSettings.USER_KEY);
    localStorage.setItem(AppSettings.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(AppSettings.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const username = localStorage.getItem(AppSettings.USERNAME_KEY);
    return !(!username || username.length <= 0);

  }

  public getAccessToken() {
    if (this.getToken() == null) {
      return ""
    } else {
      return this.getToken() as string;
    }
  }

  public setLanguage(language : string) {
    localStorage.removeItem(AppSettings.LANGUAGE);
    if(language) {
      localStorage.setItem(AppSettings.LANGUAGE,language);
    }else{
      localStorage.setItem(AppSettings.LANGUAGE,AppSettings.LANGUAGE_EN);
    }
  }

  public getLanguage() {
    let lang = localStorage.getItem(AppSettings.LANGUAGE);
    if(lang){
      return lang;
    }else{
      localStorage.setItem(AppSettings.LANGUAGE,AppSettings.LANGUAGE_EN);
      return AppSettings.LANGUAGE_EN;
    }
  }

}

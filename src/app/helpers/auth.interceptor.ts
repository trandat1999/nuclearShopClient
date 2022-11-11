import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { StorageService } from "../service/storage.service";
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../service/auth.service";
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt";
import {LoginResponse} from "../dto/AuthRequest.class";

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private jwtHelper : JwtHelperService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/api/auth') && !req.url.includes('/api/v1/publish')) {
      const token = this.storageService.getToken();
      if (!token || token.length <=0) {
        this.router.navigate(['/login']);
      }
      let isExpired = this.jwtHelper.isTokenExpired(token as string);
      if(!isExpired) {
        return  next.handle(req);
      }else{
        return this.handle401Error(req, next);
      }
    }else{
      return  next.handle(req);
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
      if (this.storageService.getUsername() && this.storageService.getRefreshToken()) {
        return this.authService.refreshToken(this.storageService.getUsername(),this.storageService.getRefreshToken()).pipe(
          switchMap((data) => {
            let loginResponse = data as LoginResponse;
            this.storageService.saveToken(loginResponse);
            const req = request.clone({
              headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + loginResponse.accessToken)
            });
            return next.handle(req);
          }),
          catchError((error) => {
            this.router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
    this.router.navigate(['/login']);
    return next.handle(request);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

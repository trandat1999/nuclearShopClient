import {Component, Input, OnInit} from '@angular/core';
import {TranslateConfigService} from "../../service/translate.service";
import {StorageService} from "../../service/storage.service";
import { Router } from '@angular/router';
import {AuthService} from "../../service/auth.service";
import {BaseResponse} from "../../dto/BaseResponse";
import {map} from "rxjs/operators";
import {CurrentUser, User} from "../../dto/AuthResponse";
import {catchError, of} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.css']
})
export class DefaultHeaderComponent implements OnInit {
  visibleData = false;
  currentUser!: User;
  currentLanguage: string = "";
  languages : language[] = [{value: "en", name: "English"}, {value: "vi", name: "Vietnamese"}];
  constructor(
    private storageService : StorageService,
    private authService : AuthService,
    private translateService: TranslateConfigService,
    private localStorage : StorageService,
    private toast : ToastrService,
    private router: Router,
    private translate : TranslateService) {
    this.currentLanguage = localStorage.getLanguage();
  }

  @Input() sidenav : any
  ngOnInit(): void {
    this.currentLanguage = this.localStorage.getLanguage();
    if(!window.location.href.includes("/login") && !window.location.href.includes("/register")
      && !window.location.href.includes("/404") && !window.location.href.includes("/500")) {
      this.authService.currentUser().pipe(map(
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
          // this.storageService.signOut();
          this.toast.error(this.translate.instant("common.commonError"),this.translate.instant("common.error"))
          return of(false);
        }
      )).subscribe(data => {
        this.visibleData = true;
        let current = data as CurrentUser
        this.currentUser = current.user;
      })
    }
  }

  changeLanguage(language : string){
    this.currentLanguage= language;
    this.translateService.changeLanguage(this.currentLanguage);
  }

  logout(){
    this.localStorage.signOut();
    this.router.navigate(["/login"])
  }
}

export interface language{
  value: string;
  name: string
}

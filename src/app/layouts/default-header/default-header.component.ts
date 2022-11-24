import {Component, Input, OnInit} from '@angular/core';
import {TranslateConfigService} from "../../service/translate.service";
import {StorageService} from "../../service/storage.service";
import { Router } from '@angular/router';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.css']
})
export class DefaultHeaderComponent implements OnInit {

  currentLanguage: string = "";
  languages : language[] = [{value: "en", name: "English"}, {value: "vi", name: "Vietnamese"}];
  constructor(
    private authService : AuthService,
    private translateService: TranslateConfigService,
    private localStorage : StorageService,
    private router: Router) {
    this.currentLanguage = localStorage.getLanguage();
  }

  @Input() sidenav : any
  ngOnInit(): void {
    this.currentLanguage = this.localStorage.getLanguage();
    if(!window.location.href.includes("/login") && !window.location.href.includes("/register")
      && !window.location.href.includes("/404") && !window.location.href.includes("/500")) {
      this.authService.currentUser().subscribe(user => {

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

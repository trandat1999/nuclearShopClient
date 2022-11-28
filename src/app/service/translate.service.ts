import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {StorageService} from "./storage.service";
import {DateAdapter} from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(private translate: TranslateService,private adapterDate: DateAdapter<any>,
  private localStorage : StorageService) {
    this.translate.use(this.localStorage.getLanguage())
    this.adapterDate.setLocale(this.localStorage.getLanguage());
  }

  changeLanguage(language: string){
    this.localStorage.setLanguage(language);
    this.translate.use(this.localStorage.getLanguage());
    this.adapterDate.setLocale(this.localStorage.getLanguage());
  }

  getLanguage(){
    return this.localStorage.getLanguage();
  }
}

import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(private translate: TranslateService,
  private localStorage : StorageService) {
    this.translate.use(this.localStorage.getLanguage())
  }

  changeLanguage(language: string){
    this.localStorage.setLanguage(language);
    this.translate.use(this.localStorage.getLanguage());
  }

  getLanguage(){
    return this.localStorage.getLanguage();
  }
}

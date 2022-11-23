import {Component, Input, OnInit} from '@angular/core';
import {TranslateConfigService} from "../../service/translate.service";
import {StorageService} from "../../service/storage.service";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.css']
})
export class DefaultHeaderComponent implements OnInit {

  currentLanguage: string = "";
  languages : language[] = [{value: "en", name: "English"}, {value: "vi", name: "Vietnamese"}];
  constructor(
    private translateService: TranslateConfigService,
    private localStorage : StorageService,) {
    this.currentLanguage = localStorage.getLanguage();
  }

  @Input() sidenav : any
  ngOnInit(): void {
    this.currentLanguage = this.localStorage.getLanguage();
  }

  changeLanguage(language : string){
    this.currentLanguage= language;
    this.translateService.changeLanguage(this.currentLanguage);
  }

  logout(){
  }
}

export interface language{
  value: string;
  name: string
}

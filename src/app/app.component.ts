import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "./service/auth.service";
import {AutoLogoutService} from "./service/autoLogoutService";
import {TranslateConfigService} from "./service/translate.service";
import {PreloaderService} from "./service/preloader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit  {
  ngAfterViewInit(): void {
    this.preloader.hide();
  }
  title = 'NuclearShopClient';
  constructor(
    private preloader: PreloaderService,
  ) {
  }
  ngOnInit(): void {
  }
}

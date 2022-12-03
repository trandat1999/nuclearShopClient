import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "./service/auth.service";
import {AutoLogoutService} from "./service/autoLogoutService";
import {TranslateConfigService} from "./service/translate.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'NuclearShopClient';

  constructor(
    private authService : AuthService,
    private router: Router,
    private autoLogoutService: AutoLogoutService,
    private translate : TranslateConfigService,
  ) {
  }

  ngOnInit(): void {
  }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
}

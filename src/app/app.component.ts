import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from "./service/auth.service";
import {AutoLogoutService} from "./service/autoLogoutService";

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
    private autoLogoutService: AutoLogoutService
  ) {
  }

  ngOnInit(): void {
    if(!window.location.href.includes("/login") && !window.location.href.includes("/register")
      && !window.location.href.includes("/404") && !window.location.href.includes("/500")) {
      this.authService.currentUser().subscribe(user => {

      })
    }
  }
}

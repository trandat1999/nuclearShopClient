import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-default-sidenav',
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.css']
})
export class DefaultSidenavComponent implements OnInit {
  currentRoute : string = this.router.url;
  listTextRouter: string[] = [this.currentRoute];
  menuList : IMenu[] = [
    {
      text : this.translate.instant("navigation.dashboard"),
      icon : "home",
      routerLink: "/dashboard",
      children : null
    },
    {
      text : this.translate.instant("navigation.category"),
      icon : "category",
      routerLink: "/category",
      children : null
    },
    {
      text : this.translate.instant("navigation.profile"),
      icon : "person",
      routerLink: "/profile",
      children : [
        {
          text : this.translate.instant("navigation.settings"),
          icon : "settings",
          routerLink: "/profile/settings",
          children : null
        },
      ]
    },
  ]

  constructor(
    private translate : TranslateService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.setOpenRouter(this.currentRoute)
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.currentRoute = evt.url;
        this.listTextRouter = [];
        this.displayExpandedRouter(this.currentRoute,this.menuList);
      }
    });
  }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
    suppressScrollY : true
  };

  displayExpandedRouter(text: string, list : IMenu[] | null): boolean {
    if(list){
      for(let i = 0; i < list.length; i++) {
        if(list[i].routerLink === text || this.displayExpandedRouter(text, list[i].children)){
          this.listTextRouter.push(list[i].routerLink);
          return true;
        }
      }
    }
    return false;
  }

  displayOpenRouter(text :string): boolean {
    return this.listTextRouter.includes(text);
  }

  setOpenRouter(text:string): void {
    this.currentRoute = text;
    this.listTextRouter = [];
    this.displayExpandedRouter(text,this.menuList);
  }
}

export interface IMenu {
  text: string,
  icon: string,
  routerLink: string;
  children: IMenu[] | null
}

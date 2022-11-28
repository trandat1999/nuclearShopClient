import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NavigationEnd, Router} from "@angular/router";
import {IMenu, navItem} from "../NavItem";

@Component({
  selector: 'app-default-sidenav',
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.css']
})
export class DefaultSidenavComponent implements OnInit {
  currentRoute : string = this.router.url;
  listTextRouter: string[] = [this.currentRoute];
  menuList = navItem

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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-default-sidenav',
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.css']
})
export class DefaultSidenavComponent implements OnInit {
  textExpend: string = "";
  listText: string[] = [];

  menuList : IMenu[] = [
    {
      text : this.translate.instant("navigation.dashboard"),
      icon : "dashboard",
      routerLink: "/dashboard",
      children : null
    },
    {
      text : this.translate.instant("navigation.category"),
      icon : "dashboard",
      routerLink: "/category",
      children : null
    },
    {
      text : "dashboard1",
      icon : "dashboard",
      routerLink: "/dashboard",
      children : [
        {
          text : "dashboard1.1",
          icon : "dashboard",
          routerLink: "/dashboard",
          children : null
        },
        {
          text : "dashboard1.2",
          icon : "dashboard",
          routerLink: "/dashboard",
          children : null
        },
      ]
    },
    {
      text : "dashboard2",
      icon : "dashboard",
      routerLink: "/dashboard",
      children : [
        {
          text : "dashboard2.1",
          icon : "dashboard",
          routerLink: "/dashboard",
          children : [
            {
              text : "dashboard2.1.1",
              icon : "dashboard",
              routerLink: "/dashboard",
              children : null
            },
            {
              text : "dashboard2.1.2",
              icon : "dashboard",
              routerLink: "/dashboard",
              children : null
            },
          ]
        },
        {
          text : "dashboard2.2",
          icon : "dashboard",
          routerLink: "/dashboard",
          children : [
            {
              text : "dashboard2.2.1",
              icon : "dashboard",
              routerLink: "/dashboard",
              children : null
            },
            {
              text : "dashboard2.2.2",
              icon : "dashboard",
              routerLink: "/dashboard",
              children : null
            },
          ]
        },
      ]
    }
  ]

  constructor(
    private translate : TranslateService
  ) { }

  ngOnInit(): void {
  }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
    suppressScrollY : true
  };

  setOpend(text:string): void {
    this.textExpend = text;
    this.listText = [];
    this.displayExpanded(text,this.menuList);
    console.log(this.listText);
  }

  displayOpen(text :string): boolean {
    return this.listText.includes(text);
  }

  displayExpanded(text: string, list : IMenu[] | null): boolean {
    if(list){
      for(let i = 0; i < list.length; i++) {
        if(list[i].text === text || this.displayExpanded(text, list[i].children)){
          this.listText.push(list[i].text);
          return true;
        }
        // else{
        //   if(list[i].children){
        //     return  this.displayExpanded(text, list[i].children);
        //   }
        // }
      }
    }
    return false;
  }
}

export interface IMenu {
  text: string,
  icon: string,
  routerLink?: string;
  children: IMenu[] | null
}

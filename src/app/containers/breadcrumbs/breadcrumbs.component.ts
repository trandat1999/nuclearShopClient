import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

export interface breadcrumb {
  link: string;
  text: string;
}
@Component({
  selector: 'breadcrumbs-component',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() crumbs: breadcrumb[] = [];
  constructor(private router: Router) {
  }
  handleClickCrumb(link: string){
    if(link) this.router.navigate([link])
  }
  navigateToHome(){
    this.router.navigate([''])
  }
  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-sidenav',
  templateUrl: './default-sidenav.component.html',
  styleUrls: ['./default-sidenav.component.css']
})
export class DefaultSidenavComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
    suppressScrollY : true
  };


}

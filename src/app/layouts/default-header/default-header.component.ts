import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.css']
})
export class DefaultHeaderComponent implements OnInit {

  constructor() { }

  @Input() sidenav : any
  ngOnInit(): void {
  }

}

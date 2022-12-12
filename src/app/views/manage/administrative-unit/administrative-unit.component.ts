import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../service/user.service";
import {AdminstrativeUnitService} from "./adminstrative-unit.service";
import { SearchRequest } from 'src/app/dto/SearchRequest.class';
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-administrative-unit',
  templateUrl: './administrative-unit.component.html',
  styleUrls: ['./administrative-unit.component.css']
})
export class AdministrativeUnitComponent implements OnInit {

  search : SearchRequest = {
    pageIndex: 0,
    pageSize: 10,
    keyword: ""
  }
  pageSizeOptions : number[] = [5,10,25, 50, 100];
  totalElement : number = 0;
  administrativeUnits : AdministrativeUnit[] = []
  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private api : AdminstrativeUnitService
  ) {}

  ngOnInit(): void {
    this.getPages();
  }

  getPages(){
    this.spinner.show()
    this.api.getPageParent(this.search).subscribe(res => {
      this.spinner.hide();
      if(res){
        this.administrativeUnits = res.content;
        this.totalElement = res.totalElements;
      }
    })
  }

  enterSearch(type: any): void {
    if (type) {
      if (this.search.keyword.length > 0) {
        this.search.pageIndex = 0;
        this.getPages();
      }
    } else {
      this.search.pageIndex = 0;
      this.getPages();
    }
  }

  handlePageEvent(event: PageEvent) {
    this.search.pageIndex = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getPages()
  }

}

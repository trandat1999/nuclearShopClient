import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {AdministrativeUnitService} from "./adminstrative-unit.service";
import { SearchRequest } from 'src/app/dto/SearchRequest.class';
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {PageEvent} from "@angular/material/paginator";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {UploadExcelDialogComponent} from "../../../containers/upload-excel-dialog/upload-excel-dialog.component";
import {BaseResponse} from "../../../dto/BaseResponse";

@Component({
  selector: 'app-administrative-unit',
  templateUrl: './administrative-unit.component.html',
  styleUrls: ['./administrative-unit.component.scss']
})
export class AdministrativeUnitComponent implements OnInit {
  @ViewChild('fileInput') myInputVariable!: ElementRef;
  columns: MtxGridColumn[] = [
    { header: this.translate.stream("administrativeUnit.name"), field: 'name', showExpand: true },
    { header: this.translate.stream("administrativeUnit.code"), field: 'code' },
    { header: this.translate.stream("administrativeUnit.description"), field: 'description' },
  ];
  log(e: any) {
    if(e.expanded && e.data && e.data.id && (!e.data.children || e.data.children.length==0)) {
      this.loading.show();
      this.api.getAllByParent(e.data.id).subscribe(data => {
        e.data.children = data;
        this.loading.hide();
      })
    }
  }

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
    private loading: NgxSpinnerService,
    private toast: ToastrService,
    private api : AdministrativeUnitService
  ) {}

  ngOnInit(): void {
    this.getPages();
  }

  getPages(){
    this.loading.show()
    this.api.getPageParent(this.search).subscribe(res => {
      this.loading.hide();
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
  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.loading.show();
      this.api.importExcel(event.target.files[0]).subscribe(data => {
          this.loading.hide();
          if (data) {
            let rs = data as BaseResponse;
            this.dialog.open(UploadExcelDialogComponent,{
              disableClose:true,
              data: rs.body
            }).afterClosed().subscribe(data => {
              this.getPages();
            })
          }
        }
      );
      this.myInputVariable.nativeElement.value = "";
    }
  }
}

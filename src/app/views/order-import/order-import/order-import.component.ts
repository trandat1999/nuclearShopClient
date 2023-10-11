import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {Warehouse} from "../../../dto/Warehouse.class";
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {OrderImportSearch} from "../../../dto/SearchRequest.class";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {ConfirmDeleteComponent} from "../../../containers/confirm-delete/confirm-delete.component";
import {Publisher} from "../../../dto/Publisher.class";
import {PageEvent} from "@angular/material/paginator";
import {OrderImportService} from "./order-import.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-order-import',
  templateUrl: './order-import.component.html',
  styleUrls: ['./order-import.component.scss']
})
export class OrderImportComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private toast: ToastrService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private api: OrderImportService,
    private router: Router
  ) {
  }
  rows: Warehouse[] = [];
  provinces: AdministrativeUnit[] = [];
  districts: AdministrativeUnit[] = [];
  communes: AdministrativeUnit[] = [];
  totalElement: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  search: OrderImportSearch = {
    pageIndex: 0,
    pageSize: 10,
    keyword: ""
  }
  loadingTable : boolean = false;
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream("common.action"), field: 'action', type: "button", width: "150px",pinned:"left",
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit',
          click: (rowData) => this.onCreateOrUpdate(rowData),
        },
        {
          color: "warn",
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete',
          click: (rowData) => this.onDelete(rowData.id),
        },
      ]
    },
    {header: this.translate.stream("importOrder.orderDate"), field: 'orderDate',sortable:true,type:"date", typeParameter: {
      format: "yyyy-MM-dd hh:mm:ss",
      }},
    {header: this.translate.stream("importOrder.staffOrder"), field: 'staffOrder',sortable:true},
    {header: this.translate.stream("importOrder.status"), field: 'status',sortable:true},
    {header: this.translate.stream("publisher.name"), field: 'publisher.name'},
    {header: this.translate.stream("warehouse.name"), field: 'warehouse.name'},
  ];
  getPages() {
    this.loadingTable= true;
    this.api.search(this.search).subscribe(data => {
        this.loadingTable= false;
        if (data) {
          this.rows = data.content;
          this.totalElement = data.totalElements;
        }
      }
    )
  }

  onDelete(id: number) {
    const dialogDelete = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: true
    });
    dialogDelete.componentInstance.save.subscribe((result) => {
      this.loading.show();
      this.api.delete(id).subscribe(data => {
        this.loading.hide();
        if (data.code === 200) {
          this.toast.success(this.translate.instant("common.deleteSuccess"), this.translate.instant("common.notification"));
          dialogDelete.close(1)
        }else{
          this.toast.success(data?.message, this.translate.instant("common.error"));
        }
      })
    })
    dialogDelete.afterClosed().subscribe(result => {
      if (result == 1) {
        this.getPages();
      }
    });
  }


  onCreateOrUpdate(publisher: Publisher | null) {
    if(publisher && publisher.id){
      this.router.navigate(["/import/order-import-edit",publisher.id])
    }else{
      this.router.navigate(["/import/order-import-edit"])
    }
  }

  enterSearch(): void {
    this.search.pageIndex = 0;
    this.getPages();
  }

  ngOnInit(): void {
    this.getPages();
  }

  handlePageEvent(event: PageEvent) {
    this.search.pageIndex = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getPages()
  }

}

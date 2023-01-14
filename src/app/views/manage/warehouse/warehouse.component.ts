import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {AdminstrativeUnitService} from "../administrative-unit/adminstrative-unit.service";
import {Publisher} from "../../../dto/Publisher.class";
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {WarehouseSearch} from "../../../dto/SearchRequest.class";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {ConfirmDeleteComponent} from "../../../containers/confirm-delete/confirm-delete.component";
import {PageEvent} from "@angular/material/paginator";
import {WarehouseService} from "./warehouse.service";
import {Warehouse} from "../../../dto/Warehouse.class";
import {DialogCreateWarehouse} from "./dialog-create-warehouse.component";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private toast: ToastrService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private api: WarehouseService,
    private administrativeUnitService: AdminstrativeUnitService
  ) {
    this.loading.show();
    this.administrativeUnitService.getAllParent().subscribe(provinces => {
      this.loading.hide();
      if (provinces) {
        this.provinces = provinces;
      }
    })
  }
  rows: Warehouse[] = [];
  provinces: AdministrativeUnit[] = [];
  districts: AdministrativeUnit[] = [];
  communes: AdministrativeUnit[] = [];
  totalElement: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  search: WarehouseSearch = {
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
    {header: this.translate.stream("common.name"), field: 'name',sortable:true},
    {header: this.translate.stream("common.code"), field: 'code',sortable:true},
    {header: this.translate.stream("warehouse.acreage"), field: 'acreage',sortable:true},
    {header: this.translate.stream("common.phoneNumber"), field: 'phoneNumber'},
    {header: this.translate.stream("common.description"), field: 'description'},
    {header: this.translate.stream("common.province"), field: 'province',sortable:true, formatter: (row) => {
        if (row.administrativeUnit && row.administrativeUnit.parent && row.administrativeUnit.parent.parent) {
          return row.administrativeUnit.parent.parent.name;
        }
        return "";
      }},
    {header: this.translate.stream("common.district"), field: 'district',sortable:true, formatter: (row) => {
        if (row.administrativeUnit && row.administrativeUnit.parent) {
          return row.administrativeUnit.parent.name;
        }
        return "";
      }},
    {header: this.translate.stream("common.commune"), field: 'administrativeUnit',sortable:true, formatter: (row) => {
        if (row.administrativeUnit) {
          return row.administrativeUnit.name;
        }
        return "";
      }},
    {header: this.translate.stream("common.address"), field: 'address'},
  ];

  getByPrent(type:number,idItem : number|undefined,clear : boolean){
    if(idItem){
      this.loading.show();
      this.administrativeUnitService.getAllByParent(idItem).subscribe(data =>{
        this.loading.hide();
        if(type==1){
          this.districts = data;
          if(clear){
            this.search.districtId = undefined;
            this.search.communeId = undefined;
          }
        }else{
          this.communes = data;
          if(clear){
            this.search.communeId = undefined;
          }
        }
      })
    }else{
      if(type==1){
        this.districts = [];
        this.communes = [];
        if(clear){
          this.search.districtId = undefined;
          this.search.communeId = undefined;
        }
      }else{
        this.communes = [];
        if(clear){
          this.search.communeId = undefined;
        }
      }
    }
    this.enterSearch();
  }
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

  openDialog(entity: Warehouse | null) {
    const dialogCreate = this.dialog.open(DialogCreateWarehouse, {
      disableClose: true,
      data: {
        entity: entity,
        provinces: this.provinces
      },
      closeOnNavigation : true
    });
    dialogCreate.afterClosed().subscribe(result => {
      if (result) {
        this.getPages();
      }
    })
  }

  onCreateOrUpdate(publisher: Publisher | null) {
    if (this.provinces.length > 0) {
      this.openDialog(publisher);
    } else {
      this.loading.show();
      this.administrativeUnitService.getAllParent().subscribe(provinces => {
        this.loading.hide();
        if (provinces) {
          this.provinces = provinces;
        }
        this.openDialog(publisher);
      })
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

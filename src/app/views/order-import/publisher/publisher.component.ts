import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MatDialog} from "@angular/material/dialog";
import {PublisherService} from "./publisher.service";
import {AdministrativeUnitService} from "../../manage/administrative-unit/adminstrative-unit.service";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {ConfirmDeleteComponent} from "../../../containers/confirm-delete/confirm-delete.component";
import {PageEvent} from "@angular/material/paginator";
import {Publisher} from "../../../dto/Publisher.class";
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {DialogCreatePublisher} from "./dialog-create-publisher.component";

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private toast: ToastrService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private api: PublisherService,
    private administrativeUnitService: AdministrativeUnitService
  ) {
  }
  publishers: Publisher[] = [];
  private provinces: AdministrativeUnit[] = [];
  totalElement: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  search: SearchRequest = {
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
    {header: this.translate.stream("common.description"), field: 'description'},
    {
      header: this.translate.stream("common.province"), field: 'province',sortable:true, formatter: (row) => {
        if (row.administrativeUnit && row.administrativeUnit.parent && row.administrativeUnit.parent.parent) {
          return row.administrativeUnit.parent.parent.name;
        }
        return "";
      }
    },
    {
      header: this.translate.stream("common.district"), field: 'district',sortable:true, formatter: (row) => {
        if (row.administrativeUnit && row.administrativeUnit.parent) {
          return row.administrativeUnit.parent.name;
        }
        return "";
      }
    },
    {
      header: this.translate.stream("common.commune"), field: 'administrativeUnit',sortable:true, formatter: (row) => {
        if (row.administrativeUnit) {
          return row.administrativeUnit.name;
        }
        return "";
      }
    },
    {header: this.translate.stream("common.address"), field: 'address'},
  ];

  getPages() {
    this.loadingTable= true;
    this.api.search(this.search).subscribe(data => {
        this.loadingTable= false;
        if (data) {
          this.publishers = data.content;
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
        }
      })
    })
    dialogDelete.afterClosed().subscribe(result => {
      if (result == 1) {
        this.getPages();
      }
    });
  }

  openDialog(publisher: Publisher | null) {
    const dialogCreate = this.dialog.open(DialogCreatePublisher, {
      disableClose: true,
      data: {
        publisher: publisher,
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

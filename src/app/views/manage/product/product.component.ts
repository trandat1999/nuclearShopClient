import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "./product.service";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import { Product } from 'src/app/dto/Product.class';
import {PageEvent} from "@angular/material/paginator";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {Category} from "../../../dto/Category";
import {map} from "rxjs/operators";
import {BaseResponse} from "../../../dto/BaseResponse";
import {catchError, of} from "rxjs";
import {CategoryService} from "../../../service/category.service";
import {UserModalCreateComponent} from "../user/user.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private translate : TranslateService,
    private toast : ToastrService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private api : ProductService,
    private categoryService : CategoryService

  ) { }
  products : Product[] = [];
  private categories : Category[] = [];
  totalElement : number = 0;
  pageSizeOptions : number[] = [5,10,25,50,100];
  search : SearchRequest = {
    pageIndex : 0,
    pageSize : 10,
    keyword : ""
  }
  columns: MtxGridColumn[] = [
    { header: this.translate.stream("common.action"), field: 'action', type: "button", buttons:[
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit',
          click: (rowData) => alert('row data:'+ rowData.id),
        },
        {
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete',
          click: (rowData) => alert('row data:'+ rowData.id),
        },
      ]},
    { header: this.translate.stream("product.name"), field: 'name'},
    { header: this.translate.stream("product.code"), field: 'code'},
    { header: this.translate.stream("product.shortDescription"), field: 'shortDescription' },
    { header: this.translate.stream("product.description"), field: 'description' },
    { header: this.translate.stream("product.categories"), field: 'categories', formatter:(row)=>{
      let cate = "";
      if(row.categories && row.categories.length>0){
        for(let item of row.categories){
          cate+= item.name + "; ";
        }
        if(cate.length>2){
          cate=cate.substring(0, cate.length - 2);
        }
      }
      return cate;
      }},
  ];
  getPages() {
    this.loading.show();
    this.api.search(this.search).subscribe(data => {
      this.loading.hide();
        if (data) {
          this.products = data.content;
          this.totalElement = data.totalElements;
        }
      }
    )
  }
  onCreateOrUpdate(product: Product|null){
    if (this.categories.length>0) {
      const dialogCreate = this.dialog.open(DialogCreateProduct, {
        disableClose: true,
        data: {
          product: product,
          categories: this.categories
        }
      });
      dialogCreate.afterClosed().subscribe(result => {
        if (result) {
          this.getPages();
        }
      })
    }else{
      this.loading.show();
      this.categoryService.getAll().subscribe(category => {
        this.loading.hide();
        if (category) {
          this.categories = category;
        }
        this.onCreateOrUpdate(product);
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


@Component({
  selector: 'product-dialog-create',
  templateUrl: 'product-dialog-create.html',
})
export class DialogCreateProduct implements OnInit {
  constructor(
    public dialogRef : MatDialogRef<DialogCreateProduct>,
    private toast : ToastrService,
    private loading : NgxSpinnerService,
    private api : ProductService,
    private translate : TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
  ) {
    this.categories = data.categories;
    this.product = data.product;
    if(!this.product){
      this.product = {
        name: "",
        code: "",
        description: "",
        shortDescription: "",
        files : [],
        categories : []
      }
    }
  }
  product!: Product;
  categories : Category[] = [];

  formGroup!: FormGroup;
  ngOnInit(): void {
    this.intiForm();
  }

  private intiForm(){
    this.formGroup = new FormGroup({
      id : new FormControl(this.product.id),
      code:  new FormControl(this.product.code),
      name: new FormControl(this.product.name),
      description: new FormControl(this.product.description),
      shortDescription: new FormControl(this.product.shortDescription),
      files : new FormControl(this.product.files),
      categories : new FormControl(this.product.categories)
    })
  }
  onSubmit(){

  }

}
export interface MatDialogData {
  categories : Category[];
  product : Product
}

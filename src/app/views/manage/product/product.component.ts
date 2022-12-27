import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "./product.service";
import {SearchRequest} from "../../../dto/SearchRequest.class";
import {File, Product} from 'src/app/dto/Product.class';
import {PageEvent} from "@angular/material/paginator";
import {MtxGridColumn} from "@ng-matero/extensions/grid";
import {Category} from "../../../dto/Category";
import {map} from "rxjs/operators";
import {BaseResponse} from "../../../dto/BaseResponse";
import {catchError, of} from "rxjs";
import {CategoryService} from "../../../service/category.service";
import {UserModalCreateComponent} from "../user/user.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {FileService} from "../../../service/file.service";
import {ConfirmDeleteComponent} from "../../../containers/confirm-delete/confirm-delete.component";

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
    { header: this.translate.stream("common.action"), field: 'action', type: "button", width:"150px",
      buttons:[
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
  onDelete(id: number) {
    const dialogDelete = this.dialog.open(ConfirmDeleteComponent,{
      disableClose : true
    });
    dialogDelete.componentInstance.save.subscribe((result) => {
      this.loading.show();
      this.api.delete(id).subscribe(data => {
        this.loading.hide();
        if(data.code === 200){
          this.toast.success(this.translate.instant("common.deleteSuccess"),this.translate.instant("common.notification"));
          dialogDelete.close(1)
        }
      })
    })
    dialogDelete.afterClosed().subscribe(result => {
      if(result==1){
        this.getPages();
      }
    });
  }
  openDialog(product: Product|null){
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
  }
  onCreateOrUpdate(product: Product|null){
    if (this.categories.length>0) {
       this.openDialog(product);
    }else{
      this.loading.show();
      this.categoryService.getAll().subscribe(category => {
        this.loading.hide();
        if (category) {
          this.categories = category;
        }
        this.openDialog(product);
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
    private fileService : FileService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
  ) {
    this.categories = data.categories;
    this.product = data.product;
    if (!this.product) {
      this.product = {
        name: "",
        code: "",
        description: "",
        shortDescription: "",
        files: [],
        categories: []
      }
    }
  }
  fileOptions :File[] = [];
  product!: Product;
  categories : Category[] = [];
  formGroup!: FormGroup;
  ngOnInit(): void {
    this.intiForm();
    this.fileOptions = [...this.product.files];
  }

  private intiForm(){
    this.formGroup = new FormGroup({
      id : new FormControl(this.product.id),
      code:  new FormControl(this.product.code,[Validators.required]),
      name: new FormControl(this.product.name,[Validators.required]),
      description: new FormControl(this.product.description),
      shortDescription: new FormControl(this.product.shortDescription),
      files : new FormControl(this.product.files,[Validators.required]),
      categories : new FormControl(this.product.categories,[Validators.required])
    })
  }
  getErrorMessage(field: string){
    if(this.formGroup && field){
      if(field=="code" && this.formGroup.controls['code'].errors ) {
        if (this.formGroup.controls['code'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }else if (this.formGroup.controls['code'].errors?.['serverError'] ||
          this.formGroup.controls['code'].errors?.['serverErrorMess']) {
          return  this.formGroup.controls['code'].errors?.['serverErrorMess'];
        }
      }
      if(field=="name" && this.formGroup.controls['name'].errors ) {
        if (this.formGroup.controls['name'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }else if (this.formGroup.controls['code'].errors?.['serverError'] ||
          this.formGroup.controls['code'].errors?.['serverErrorMess']) {
          return  this.formGroup.controls['code'].errors?.['serverErrorMess'];
        }
      }
      if(field=="categories" && this.formGroup.controls['categories'].errors ) {
        if (this.formGroup.controls['categories'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }else if (this.formGroup.controls['categories'].errors?.['serverError'] ||
          this.formGroup.controls['categories'].errors?.['serverErrorMess']) {
          return  this.formGroup.controls['categories'].errors?.['serverErrorMess'];
        }
      }
      if(field=="files" && this.formGroup.controls['files'].errors ) {
        if (this.formGroup.controls['files'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }else if (this.formGroup.controls['files'].errors?.['serverError'] ||
          this.formGroup.controls['files'].errors?.['serverErrorMess']) {
          return  this.formGroup.controls['files'].errors?.['serverErrorMess'];
        }
      }
    }
    return "";
  }

  save(data: Product) {
    this.loading.show();
    this.api.save(data).subscribe(data => {
      this.loading.hide();
      if(data instanceof HttpErrorResponse){
        let error = data.error;
        if(error && error.errors){
          Object.keys(error.errors).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true,'serverErrorMess': error.errors[key]});
          });
          return;
        }
      }
      let rs = data as BaseResponse
      if(rs && (rs.code === 200 || rs.code === 201)){
        this.toast.success(this.translate.instant("common.success"),this.translate.instant("common.notification"));
        this.dialogRef.close(1);
      }else{
        if(rs && rs.body && rs.body){
          Object.keys(rs.body).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true,'serverErrorMess': rs.body[key]});
          });
          return;
        }
      }
    })
  }

  update(data: Product, id : number) {
    this.loading.show();
    this.api.put(id,data).subscribe(data => {
      this.loading.hide();
      if(data instanceof HttpErrorResponse){
        let error = data.error;
        if(error && error.errors){
          Object.keys(error.errors).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true,'serverErrorMess': error.errors[key]});
          });
          return;
        }
      }
      let rs = data as BaseResponse
      if(rs && (rs.code === 200 || rs.code === 201)){
        this.toast.success(this.translate.instant("common.success"),this.translate.instant("common.notification"));
        this.dialogRef.close(1);
      }else{
        if(rs && rs.body && rs.body){
          Object.keys(rs.body).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true,'serverErrorMess': rs.body[key]});
          });
          return;
        }
      }
    })
  }
  onSubmit(){
    if(this.product.id){
      this.update(this.formGroup.value,this.product.id)
    }else{
      this.save(this.formGroup.value);
    }
  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.loading.show();
      this.fileService.upload(event.target.files[0]).subscribe(data => {
          this.loading.hide();
          if (data) {
            let baseResponse = data as BaseResponse;
            this.fileOptions = [...this.fileOptions,baseResponse.body];
            let valueFormFile = this.formGroup.controls["files"].value;
            valueFormFile.push(baseResponse.body)
            this.formGroup.controls["files"].setValue([...valueFormFile]);
          }
        }
      );
    }
  }

}
export interface MatDialogData {
  categories : Category[];
  product : Product
}

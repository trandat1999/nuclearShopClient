import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../../dto/Category";
import {BaseResponse} from "../../../dto/BaseResponse";
import {TranslateService} from "@ngx-translate/core";
import { PageEvent } from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {map, startWith} from "rxjs/operators";
import {catchError, Observable, of} from "rxjs";
import {FormControl, FormGroup, UntypedFormControl, Validators} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  pageEvent! : PageEvent;
  totalElement: number = 0;
  pageSizeOptions: number[] = [5,10,20,50,100];
  displayedColumns: string[] = ['action', 'name', 'code', 'description', 'parent'];
  categories : Array<Category> = [];
  category! : Category;
  categoryParent : Array<Category> = [];
  search : any = {
    pageIndex : 0,
    pageSize : 10,
    keyword : ""
  }
  constructor(
    private categoryService: CategoryService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getPages()
  }

  enterSearch(type :any): void {
    if(type){
      if(this.search.keyword.length>0) {
        this.search.pageIndex = 0;
        this.getPages();
      }
    }else{
      this.search.pageIndex = 0;
      this.getPages();
    }
  }

  getPages(){
    this.spinner.show();
    this.categoryService.getPages(this.search).pipe(
      map(value => {
        this.spinner.hide();
        return value
      }),catchError(error => {
        this.spinner.hide();
        this.toast.error(this.translateService.instant("common.commonError"), this.translateService.instant("common.error"))
        return of(false)
      })
    ).subscribe(data => {
      this.spinner.hide();
      if(data){
        let rs = data as BaseResponse
        this.categories = rs.body.content;
        this.totalElement = rs.body.totalElements;
      }
    })
  }

  delete(id: number): void {
    const dialogDelete = this.dialog.open(CategoryDialogDeleteConfirm,{
      data: id,
      disableClose : true
    });
    dialogDelete.afterClosed().subscribe(result => {
      if(result==1){
        this.getPages();
      }
    });
  }

  update(category: Category): void {
    this.spinner.show();
    this.categoryService.getAllParent().pipe(
      map(value => {
        return value
      }),catchError(error => {
        return of(false)
      })
    ).subscribe(data => {
      this.spinner.hide();
      let rs = data as BaseResponse
      this.categoryParent = rs.body;
      this.categoryParent = this.categoryParent.filter(item => item.id != category.id)
      const dialogCreate = this.dialog.open(DialogCreate,{
        data: {
          category : category,
          categoryParent : this.categoryParent
        },
        disableClose : true
      });
      dialogCreate.afterClosed().subscribe(result => {
        if(result==1){
          this.getPages();
        }
      });
    })
  }

  handlePageEvent(event : PageEvent){
    this.pageEvent = event;
    this.search.pageIndex = this.pageEvent.pageIndex;
    this.search.pageSize = this.pageEvent.pageSize;
    this.getPages()
  }

  onCreate(){
    this.spinner.show();
    this.categoryService.getAllParent().pipe(
      map(value => {
        return value
      }),catchError(error => {
        return of(false)
      })
    ).subscribe(data => {
      this.spinner.hide();
      let rs = data as BaseResponse
      this.categoryParent = rs.body;
      this.category = new Category();
      const dialogCreate = this.dialog.open(DialogCreate,{
        data: {
          category : this.category,
          categoryParent : this.categoryParent
        },
        disableClose : true
      });
      dialogCreate.afterClosed().subscribe(result => {
        if(result==1){
          this.getPages();
        }
      });
    })
  }
}


@Component({
  selector: 'category-dialog-create',
  templateUrl: 'category-dialog-create.html',
})
export class DialogCreate implements OnInit {
  category! : Category
  categoryParent! : Array<Category>
  filteredOptions!: Observable<Category[]>;
  categoryForm! : FormGroup;
  public categoryFilterCtrl: UntypedFormControl = new UntypedFormControl();
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  constructor(
    public dialogRef: MatDialogRef<DialogCreate>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
    private categoryService: CategoryService,
    private translateService: TranslateService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.category = data.category;
    this.categoryParent = data.categoryParent;
  }
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl(this.category.name, Validators.required),
      code: new FormControl(this.category.code, Validators.required),
      description: new FormControl(this.category.description),
      parentId : new FormControl(this.category.parentId),
      id : new FormControl(this.category.id),
    })
    this.filteredOptions = this.categoryFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.categoryParent.slice();
      }),
    );

  }

  displayFn (id: number): string {
    let name = this.categoryParent?.find(category => category.id == id)?.name;
    return  name?name:'';
  }
  onNoClick(): void {
    this.dialogRef.close(0);
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categoryParent.filter(item => item.name?.toLowerCase().includes(filterValue));
  }

  onSubmit(){
    this.spinner.show();
    this.categoryService.saveOrUpdate(this.categoryForm.value).pipe(map(
      (data) =>{
        this.spinner.hide();
        return data;
      }
    ),catchError(
      (error) => {
        if(error && error.error && error.error.errors){
            Object.keys(error.error.errors).forEach(key => {
              this.categoryForm.controls[key].setErrors({'serverError': true,'serverErrorExistMess': error.error.errors[key]});
            });
        }
        this.spinner.hide();
       return of(false);
      }
    )).subscribe(data => {
      this.spinner.hide();
      let rs = data as BaseResponse
      if(rs && rs.code === 200){
        this.toast.success(this.translateService.instant("common.success"),this.translateService.instant("common.notification"));
        this.dialogRef.close(1);
      }else{
        if(rs && rs.body && rs.body){
            Object.keys(rs.body).forEach(key => {
              this.categoryForm.controls[key].setErrors({'alreadyExist': true,'alreadyExistMess': rs.body[key]});
            });
          return;
        }
      }
      return;
    })
  }

  getErrors(key :String) {
    if(this.categoryForm && key){
      if(key=="code" && this.categoryForm.controls['code'].errors ) {
        if (this.categoryForm.controls['code'].errors?.['required']) {
          return this.translateService.instant("categoryComponent.codeRequired");
        } else if (this.categoryForm.controls['code'].errors?.['alreadyExist'] || this.categoryForm.controls['code'].errors?.['alreadyExistMess']) {
          return  this.categoryForm.controls['code'].errors?.['alreadyExistMess'];
        }else if (this.categoryForm.controls['code'].errors?.['serverError'] || this.categoryForm.controls['code'].errors?.['serverErrorExistMess']) {
          return  this.categoryForm.controls['code'].errors?.['serverErrorExistMess'];
        }
      }
      if(key=="name" && this.categoryForm.controls['name'].errors ) {
        if (this.categoryForm.controls['name'].errors?.['required']) {
          return this.translateService.instant("categoryComponent.nameRequired");
        } else if (this.categoryForm.controls['name'].errors?.['serverError'] || this.categoryForm.controls['name'].errors?.['serverErrorExistMess']) {
          return  this.categoryForm.controls['name'].errors?.['serverErrorExistMess'];
        }
      }
    }
    return "";
  }
}

@Component({
  selector: 'category-dialog-delete-confirm',
  templateUrl: 'category-dialog-confirm-delete.html',
})
export class CategoryDialogDeleteConfirm{
  id : number
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogDeleteConfirm>,
    @Inject(MAT_DIALOG_DATA) public idInput: number,
    private categoryService: CategoryService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {
    this.id  = idInput
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

  confirmDelete(){
    this.spinner.show();
    this.categoryService.delete(this.id).subscribe(data => {
      this.spinner.hide();
      let rs = data as BaseResponse
      if(rs.code === 200){
        this.toast.success(this.translate.instant("common.deleteSuccess"),this.translate.instant("common.notification"));
        this.dialogRef.close(1)
      }
    },error => {
      this.spinner.hide();
    })
  }
}

export interface MatDialogData{
  category : Category,
  categoryParent : Array<Category>
}

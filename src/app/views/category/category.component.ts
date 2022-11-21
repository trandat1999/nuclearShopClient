import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../dto/Category";
import {BaseResponse} from "../../dto/BaseResponse";
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
  styleUrls: ['./category.component.css']
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
    private spinner: NgxSpinnerService
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
    this.categoryService.getPages(this.search).subscribe(data => {
      this.spinner.hide();
      let rs = data as BaseResponse
      this.categories = rs.body.content;
      this.totalElement = rs.body.totalElements;
    },error => {
      this.spinner.hide();
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
        return error
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
        this.getPages();
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
    private toast: ToastrService
  ) {
    this.category = data.category;
    this.categoryParent = data.categoryParent;
  }
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl(this.category.name, Validators.required),
      code: new FormControl(this.category.code, Validators.required),
      description: new FormControl(this.category.description),
      parentId : new FormControl(this.category.parentId)
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
    this.dialogRef.close();
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categoryParent.filter(item => item.name?.toLowerCase().includes(filterValue));
  }

  onSubmit(){
    this.categoryService.save(this.categoryForm.value).subscribe(data => {
      if(data && data.code === 200){
        this.toast.success(this.translateService.instant("common.success"),this.translateService.instant("common.notification"));
        this.dialogRef.close();
      }else{
        if(data && data.body && data.body.length){
          for(let er of data.body){
            Object.keys(er).forEach(key => {
              this.categoryForm.controls[key].setErrors({'alreadyExist': true,'alreadyExistMess': er[key]});
            });
          }
          return;
        }
      }
    })
  }

  getErrors(key :String) {
    if(this.categoryForm && key){
      if(key=="code" && this.categoryForm.controls['code'].errors &&
        (this.categoryForm.controls['code'].touched || this.categoryForm.controls['code'].dirty)) {
        if (this.categoryForm.controls['code'].errors?.['required']) {
          return this.translateService.instant("categoryComponent.codeRequired");
        } else if (this.categoryForm.controls['code'].errors?.['alreadyExist'] || this.categoryForm.controls['code'].errors?.['alreadyExistMess']) {
          return  this.categoryForm.controls['code'].errors?.['alreadyExistMess'];
        }
      }
    }
    return "";
  }
}

export interface MatDialogData{
  category : Category,
  categoryParent : Array<Category>
}

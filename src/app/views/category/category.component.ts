import {Component, Inject, OnInit} from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../dto/Category";
import {BaseResponse} from "../../dto/BaseResponse";
import {TranslateService} from "@ngx-translate/core";
import { PageEvent } from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {map, startWith} from "rxjs/operators";
import {catchError, Observable} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  pageEvent! : PageEvent;
  totalElement: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5,10,20,50,100];
  displayedColumns: string[] = ['action', 'name', 'code', 'description', 'parent'];
  categories : Array<Category> = [];
  category! : Category;
  categoryParent : Array<Category> = [];
  constructor(
    private categoryService: CategoryService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.categoryService.getPages({}).subscribe(data => {
      let rs = data as BaseResponse
      this.categories = rs.body.content;
    })
  }

  handlePageEvent(event : PageEvent){
    this.pageEvent = event;
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
  constructor(
    public dialogRef: MatDialogRef<DialogCreate>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
    private categoryService: CategoryService
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
    this.filteredOptions = this.categoryForm.controls['parentId'].valueChanges.pipe(
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
        let responseSuccess = data as BaseResponse;
      }else{
        if(data && data.body && data.body.length){
          for(let er of data.body){
            Object.keys(er).forEach(key => {
              this.categoryForm.controls[key].setErrors({'alreadyExist': true});
            });
          }
          return;
        }
      }
    })
  }
}

export interface MatDialogData{
  category : Category,
  categoryParent : Array<Category>
}

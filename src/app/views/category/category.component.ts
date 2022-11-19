import {Component, Inject, OnInit} from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../dto/Category";
import {BaseResponse} from "../../dto/BaseResponse";
import {TranslateService} from "@ngx-translate/core";
import { PageEvent } from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

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
    public dialog: MatDialog
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
    this.categoryService.getPages({}).subscribe(data => {
      let rs = data as BaseResponse
      this.categories = rs.body.content;
    })
    this.category = {
      id : 0,
      code : "",
      name : "",
      description : "",
      parentId : 0
    }
    const dialogCreate = this.dialog.open(DialogCreate,{
      data: {
        category : this.category,
        categoryParent : this.categoryParent
      },
      disableClose : true
    });
  }

}


@Component({
  selector: 'category-dialog-create',
  templateUrl: 'category-dialog-create.html',
})
export class DialogCreate {
  constructor(
    public dialogRef: MatDialogRef<DialogCreate>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface MatDialogData{
  category : Category,
  categoryParent : Array<Category>
}

import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../dto/Category";
import {BaseResponse} from "../../dto/BaseResponse";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'code', 'description', 'parentId'];
  categories : Array<Category> = [];
  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getPages({}).subscribe(data => {
      let rs = data as BaseResponse
      this.categories = rs.body.content;
    })
  }

}

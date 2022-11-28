import {Component, Inject, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../service/user.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {map} from "rxjs/operators";
import {catchError, of} from "rxjs";
import {BaseResponse} from "../../../dto/BaseResponse";
import {Person, Role} from "../../../dto/AuthResponse";
import {PageEvent} from "@angular/material/paginator";
import {CategoryService} from "../../../service/category.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface UserResponse {
  user: User
}

export interface User {
  id : number
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  enabled: boolean;
  roles: Role[];
  person: Person;

}

export interface ModelCreate{
  user: User;
  roles: Role[];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.getPages();
  }

  pageEvent!: PageEvent;
  users: UserResponse[] = []
  totalElement: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  search: any = {
    pageIndex: 0,
    pageSize: 10,
    keyword: ""
  }


  enterSearch(type: any): void {
    if (type) {
      if (this.search.keyword.length > 0) {
        this.search.pageIndex = 0;
        this.getPages();
      }
    } else {
      this.search.pageIndex = 0;
      this.getPages();
    }
  }

  getPages() {
    this.spinner.show();
    this.userService.getPages(this.search).pipe(
      map(value => {
        return value
      }), catchError(error => {
        this.toast.error(this.translateService.instant("common.commonError"), this.translateService.instant("common.error"))
        return of(false)
      })
    ).subscribe(data => {
      this.spinner.hide();
      if (data) {
        let rs = data as BaseResponse
        this.users = rs.body.content;
        this.totalElement = rs.body.totalElements;
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent = event;
    this.search.pageIndex = this.pageEvent.pageIndex;
    this.search.pageSize = this.pageEvent.pageSize;
    this.getPages()
  }

  update() {

  }

  delete() {

  }

  create(){
    this.spinner.show();
    this.userService.getAllRole().pipe(
      map(data => {
        let rs = data as BaseResponse
        return rs.body;
      }),
      catchError(err => {
        this.toast.error(this.translateService.instant("common.commonError"), this.translateService.instant("common.error"))
        return of(false);
      })
    ).subscribe(role => {
      this.spinner.hide();
      if(role){
        const dialogCreate = this.dialog.open(UserModalCreateComponent, {
          disableClose: true,
          data : {
            user: {
              person : {}
            },
            roles : role
          }
        });
        dialogCreate.afterClosed().subscribe(result => {
          if(result){
            this.getPages();
          }
        })
      }
    })

  }

  displayRoles(roles: Role[]) {
    let rs = "";
    if (roles.length > 0) {
      for (let role of roles) {
        rs += role.name + ", "
      }
    }
    if (rs.length > 0) {
      rs = rs.slice(0, -2)
    }
    return rs;
  }
}


@Component({
  selector: 'user-modal-create',
  templateUrl: 'user.create.component.html',
})
export class UserModalCreateComponent implements OnInit{
  roles : Role[] = []
  user! : User
  userForm! : FormGroup
  constructor(
    public dialogRef: MatDialogRef<UserModalCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelCreate,
    private userService: UserService,
    private translateService: TranslateService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.roles = data.roles;
    this.user = data.user;
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl(this.user.password),
      confirmPassword : new FormControl(this.user.confirmPassword),
      email : new FormControl(this.user.email, [Validators.required,Validators.email]),
      enabled : new FormControl(this.user.enabled, [Validators.required])
    })
  }

  onsubmit(){

  }


  getErrors(key :String) {
    if(this.userForm && key){
      if(key=="username" && this.userForm.controls['username'].errors ) {
        if (this.userForm.controls['username'].errors?.['required']) {
          return this.translateService.instant("categoryComponent.codeRequired");
        } else if (this.userForm.controls['code'].errors?.['alreadyExist'] || this.userForm.controls['code'].errors?.['alreadyExistMess']) {
          return  this.userForm.controls['code'].errors?.['alreadyExistMess'];
        }else if (this.userForm.controls['code'].errors?.['serverError'] || this.userForm.controls['code'].errors?.['serverErrorExistMess']) {
          return  this.userForm.controls['code'].errors?.['serverErrorExistMess'];
        }
      }
      if(key=="email" && this.userForm.controls['email'].errors ) {
        if (this.userForm.controls['email'].errors?.['required']) {
          return this.translateService.instant("categoryComponent.nameRequired");
        } else if (this.userForm.controls['email'].errors?.['serverError'] || this.userForm.controls['email'].errors?.['serverErrorExistMess']) {
          return  this.userForm.controls['email'].errors?.['serverErrorExistMess'];
        }
      }
    }
    return "";
  }
}

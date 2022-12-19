import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../service/user.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {map, take, takeUntil} from "rxjs/operators";
import {catchError, of, ReplaySubject, Subject} from "rxjs";
import {BaseResponse} from "../../../dto/BaseResponse";
import {Person, Role} from "../../../dto/AuthResponse";
import {PageEvent} from "@angular/material/paginator";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Gender} from "../../../dto/Enum.class";
import {MatSelect} from "@angular/material/select";
import {CategoryService} from "../../../service/category.service";
import {CategoryDialogDeleteConfirm} from "../category/category.component";
import {ConfirmDeleteComponent} from "../../../containers/confirm-delete/confirm-delete.component";

export interface UserResponse {
  user: User
}

export interface User {
  id: number
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  enabled: boolean;
  roles: Role[];
  person: Person;

}

export interface ModelCreate {
  user: User;
  roles: Role[];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
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
    this.getAllRole();
    this.getPages();
  }
  roles : Role[] = [];
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

  getAllRole(){
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
      if (role) {
        this.roles = role;
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent = event;
    this.search.pageIndex = this.pageEvent.pageIndex;
    this.search.pageSize = this.pageEvent.pageSize;
    this.getPages()
  }

  update(user : User) {
    if(user && (user.person === null || user.person === undefined)) {
      user.person = new Person();
    }
    if (this.roles.length>0) {
      const dialogCreate = this.dialog.open(UserModalCreateComponent, {
        disableClose: true,
        data: {
          user: user,
          roles: this.roles
        }
      });
      dialogCreate.afterClosed().subscribe(result => {
        if (result) {
          this.getPages();
        }
      })
    }else{
      this.getAllRole();
      this.update(user);
    }

  }

  delete(id : number) {
    const dialogDelete = this.dialog.open(ConfirmDeleteComponent,{
      disableClose : true
    });
    dialogDelete.componentInstance.save.subscribe((result) => {
      this.userService.delete(id).subscribe(data => {
        this.spinner.hide();
        let rs = data as BaseResponse
        if(rs.code === 200){
          this.toast.success(this.translateService.instant("common.deleteSuccess"),this.translateService.instant("common.notification"));
          dialogDelete.close(1)
        }
      },error => {
        this.toast.error(this.translateService.instant("common.commonError"), this.translateService.instant("common.error"))
        this.spinner.hide();
      })
    })
    dialogDelete.afterClosed().subscribe(result => {
      if(result==1){
        this.getPages();
      }
    });
  }

  create() {
    if (this.roles.length>0) {
      const dialogCreate = this.dialog.open(UserModalCreateComponent, {
        disableClose: true,
        data: {
          user: {
            person: {}
          },
          roles: this.roles
        }
      });
      dialogCreate.afterClosed().subscribe(result => {
        if (result) {
          this.getPages();
        }
      })
    }else{
      this.getAllRole();
      this.create();
    }

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
export class UserModalCreateComponent implements OnInit,AfterViewInit {
  nowDate: Date | null = new Date();
  @ViewChild('multiSelect', {static: true}) multiSelect!: MatSelect;
  genders = Gender;
  roles: Role[] = []
  user!: User
  userForm!: FormGroup
  roleFilterCtrl: UntypedFormControl = new UntypedFormControl();
  protected filteredRoleCache: Role[] = [];
  public filteredOptions: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
  protected _onDestroy = new Subject<void>();
  isIndeterminate = false;
  isChecked = false;

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
    this.initForm();
    this.filteredOptions.next(this.roles.slice());
    this.userForm.controls['roles'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filter();
        this.setToggleAllCheckboxState();
      });
    this.roleFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this._filter();
        this.setToggleAllCheckboxState();
      });

  }

  private initForm(): void {
    this.userForm = new FormGroup({
      id: new FormControl(this.user.id),
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl(this.user.password, this.user.id ? [] : [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(this.user.confirmPassword),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      enabled: new FormControl((this.user.enabled != null) ? this.user.enabled : true, [Validators.required]),
      changePassword: new FormControl(),
      roles: new FormControl(this.user.roles, [Validators.required]),
      person: new FormGroup({
        firstName: new FormControl(this.user.person.firstName, [Validators.required]),
        lastName: new FormControl(this.user.person.lastName, Validators.required),
        gender: new FormControl(this.user.person.gender, [Validators.required]),
        birthDate: new FormControl(this.user.person.birthDate?new Date(this.user.person.birthDate):this.user.person.birthDate, Validators.required),
        phoneNumber: new FormControl(this.user.person.phoneNumber, [Validators.pattern("((84|0|'+'84)[3|5|7|8|9])+([0-9]{8})")]),
      })
    }, {validators: this.MatchingPasswords()});
  }

  ngAfterViewInit(): void {
    this.setInitialValue();
  }
  protected setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Role, b: Role) => a && b && a.id === b.id;
      });
  }

  private _filter() {
    if (!this.roles) {
      return;
    }
    let search = this.roleFilterCtrl.value;
    if (!search) {
      this.filteredRoleCache = this.roles.slice();
      this.filteredOptions.next(this.filteredRoleCache);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRoleCache = this.roles.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    this.filteredOptions.next(
      this.filteredRoleCache
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredOptions.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.userForm.controls['roles'].patchValue(val);
        } else {
          this.userForm.controls['roles'].patchValue([]);
        }
      });
  }

  protected setToggleAllCheckboxState() {
    let filteredLength = 0;
    if (this.userForm.controls['roles'] && this.userForm.controls['roles'].value) {
      this.filteredRoleCache.forEach(el => {
        if (this.userForm.controls['roles'].value.indexOf(el) > -1) {
          filteredLength++;
        }
      });
      this.isIndeterminate = filteredLength > 0 && filteredLength < this.filteredRoleCache.length;
      this.isChecked = filteredLength > 0 && filteredLength === this.filteredRoleCache.length;
    }
  }

  onsubmit() {
    if (this.user.id) {
      this.spinner.show();
      this.userService.update(this.userForm.value, this.user.id)
        .pipe(
          map((data) => {
            return data;
          }),
          catchError((error) => {
            if(error && error.error && error.error.errors){
              Object.keys(error.error.errors).forEach(key => {
                this.userForm.controls[key]?.setErrors({'serverError': true,'serverErrorExistMess': error.error.errors[key]});
              });
            }
            return of(false);
          })
        )
        .subscribe(data => {
          this.spinner.hide();
          if (data && data.code === 200) {
            this.toast.success(this.translateService.instant("common.updateSuccess"),this.translateService.instant("common.notification"))
            this.dialogRef.close(1);
          }else{
            if(data && data.body){
              Object.keys(data.body).forEach(key => {
                this.userForm.controls[key]?.setErrors({'alreadyExist': true});
              });
              return;
            }
          }
        })
    } else {
      this.spinner.show();
      this.userService.save(this.userForm.value)
        .pipe(
          map((data) => {
            return data;
          }),
          catchError((error) => {
            if(error && error.error && error.error.errors){
              Object.keys(error.error.errors).forEach(key => {
                this.userForm.controls[key]?.setErrors({'serverError': true,'serverErrorExistMess': error.error.errors[key]});
              });
            }
            return of(false);
          })
        )
        .subscribe(data => {
          this.spinner.hide();
          if (data && data.code === 201) {
            this.toast.success(this.translateService.instant("common.createdSuccess"),this.translateService.instant("common.notification"))
            this.dialogRef.close(1);
          }else{
            if(data && data.body){
              Object.keys(data.body).forEach(key => {
                this.userForm.controls[key].setErrors({'serverError': true,'serverErrorExistMess': data.body[key]});
              });
              return;
            }
          }
        })
    }
  }

  MatchingPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const changePassword = control.get('changePassword')?.value;
      if (!changePassword) {
        return null;
      }
      control.get('password')?.addValidators([Validators.required, Validators.minLength(6)]);
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      const currentErrors = control.get('confirmPassword')?.errors
      const confirmControl = control.get('confirmPassword')
      if (password !== confirmPassword && confirmPassword !== '') {
        confirmControl?.setErrors({...currentErrors, not_matching: true});
        return null;
      } else {
        // @ts-ignore
        confirmControl?.setErrors(currentErrors)
        return null;
      }
    }

  }

  getErrors(key: String) {
    if (this.userForm && key) {
      if (key == "username" && this.userForm.controls['username'].errors) {
        if (this.userForm.controls['username'].errors?.['required']) {
          return this.translateService.instant("validation.required");
        } else if (this.userForm.controls['username'].errors?.['alreadyExist'] || this.userForm.controls['username'].errors?.['alreadyExistMess']) {
          return this.userForm.controls['username'].errors?.['alreadyExistMess'];
        } else if (this.userForm.controls['username'].errors?.['serverError'] || this.userForm.controls['username'].errors?.['serverErrorExistMess']) {
          return this.userForm.controls['username'].errors?.['serverErrorExistMess'];
        }
      }
      if (key == "email" && this.userForm.controls['email'].errors) {
        if (this.userForm.controls['email'].errors?.['required']) {
          return this.translateService.instant("validation.required");
        } else if (this.userForm.controls['email'].errors?.['serverError'] || this.userForm.controls['email'].errors?.['serverErrorExistMess']) {
          return this.userForm.controls['email'].errors?.['serverErrorExistMess'];
        }
        else if (this.userForm.controls['email'].errors?.['email']) {
          return this.translateService.instant("validation.email");
        }
      }
      if (key == "password" && this.userForm.controls['password'].errors) {
        if (this.userForm.controls['password'].errors?.['required']) {
          return this.translateService.instant("validation.required");
        } else if (this.userForm.controls['password'].errors?.['minlength']) {
          return this.translateService.instant("validation.invalid");
        }
      }
      if (key == "confirmPassword" && this.userForm.controls['confirmPassword'].errors) {
        if (this.userForm.controls['confirmPassword'].errors?.['not_matching']) {
          return this.translateService.instant("validation.password_not_match");
        }
      }
    }
    return "";
  }


}

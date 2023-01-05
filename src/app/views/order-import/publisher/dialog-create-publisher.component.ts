import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogCreateProduct} from "../../manage/product/product.component";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseResponse} from "../../../dto/BaseResponse";
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {Publisher} from "../../../dto/Publisher.class";
import {PublisherService} from "./publisher.service";
import {AdminstrativeUnitService} from "../../manage/administrative-unit/adminstrative-unit.service";

@Component({
  selector: 'publisher-dialog-create',
  templateUrl: 'publisher-dialog-create.html',
})
export class DialogCreatePublisher implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateProduct>,
    private toast: ToastrService,
    private loading: NgxSpinnerService,
    private api: PublisherService,
    private translate: TranslateService,
    private administrativeUnitService: AdminstrativeUnitService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
  ) {
    this.provinces = data.provinces;
    this.publisher = data.publisher;
    if (!this.publisher) {
      this.publisher = new Publisher();
    }
  }

  publisher!: Publisher;
  provinces: AdministrativeUnit[] = [];
  districts: AdministrativeUnit[] = [];
  communes: AdministrativeUnit[] = [];
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.intiForm();
  }

  private intiForm() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.publisher.id),
      code: new FormControl(this.publisher.code, [Validators.required]),
      name: new FormControl(this.publisher.name, [Validators.required]),
      description: new FormControl(this.publisher.description),
      province: new FormControl(this.publisher.province, [Validators.required]),
      district: new FormControl(this.publisher.district, [Validators.required]),
      address: new FormControl(this.publisher.address),
      administrativeUnit: new FormControl(this.publisher.administrativeUnit, [Validators.required])
    })
  }

  getErrorMessage(field: string) {
    if (this.formGroup && field) {
      if (field == "code" && this.formGroup.controls['code'].errors) {
        if (this.formGroup.controls['code'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        } else if (this.formGroup.controls['code'].errors?.['serverError'] ||
          this.formGroup.controls['code'].errors?.['serverErrorMess']) {
          return this.formGroup.controls['code'].errors?.['serverErrorMess'];
        }
      }
      if (field == "name" && this.formGroup.controls['name'].errors) {
        if (this.formGroup.controls['name'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        } else if (this.formGroup.controls['code'].errors?.['serverError'] ||
          this.formGroup.controls['code'].errors?.['serverErrorMess']) {
          return this.formGroup.controls['code'].errors?.['serverErrorMess'];
        }
      }
      if (field == "province" && this.formGroup.controls['province'].errors) {
        if (this.formGroup.controls['province'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }
      }
      if (field == "district" && this.formGroup.controls['district'].errors) {
        if (this.formGroup.controls['district'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }
      }
      if (field == "administrativeUnit" && this.formGroup.controls['administrativeUnit'].errors) {
        if (this.formGroup.controls['administrativeUnit'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }
      }
    }
    return "";
  }

  save(data: Publisher) {
    this.loading.show();
    this.api.save(data).subscribe(data => {
      this.loading.hide();
      if (data instanceof HttpErrorResponse) {
        let error = data.error;
        if (error && error.errors) {
          Object.keys(error.errors).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true, 'serverErrorMess': error.errors[key]});
          });
          return;
        }
      }
      let rs = data as BaseResponse
      if (rs && (rs.code === 200 || rs.code === 201)) {
        this.toast.success(this.translate.instant("common.success"), this.translate.instant("common.notification"));
        this.dialogRef.close(1);
      } else {
        if (rs && rs.body && rs.body) {
          Object.keys(rs.body).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true, 'serverErrorMess': rs.body[key]});
          });
          return;
        }
      }
    })
  }

  update(data: Publisher, id: number) {
    this.loading.show();
    this.api.put(id, data).subscribe(data => {
      this.loading.hide();
      if (data instanceof HttpErrorResponse) {
        let error = data.error;
        if (error && error.errors) {
          Object.keys(error.errors).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true, 'serverErrorMess': error.errors[key]});
          });
          return;
        }
      }
      let rs = data as BaseResponse
      if (rs && (rs.code === 200 || rs.code === 201)) {
        this.toast.success(this.translate.instant("common.success"), this.translate.instant("common.notification"));
        this.dialogRef.close(1);
      } else {
        if (rs && rs.body && rs.body) {
          Object.keys(rs.body).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true, 'serverErrorMess': rs.body[key]});
          });
          return;
        }
      }
    })
  }

  onSubmit() {
    if (this.publisher.id) {
      this.update(this.formGroup.value, this.publisher.id)
    } else {
      this.save(this.formGroup.value);
    }
  }

  getByPrent(type:number,item : AdministrativeUnit){
    if(item && item.id){
      this.loading.show();
      this.administrativeUnitService.getAllByParent(item.id).subscribe(data =>{
        this.loading.hide();
        if(type==1){
          this.districts = data;
          this.formGroup.controls['district'].setValue(undefined);
          this.formGroup.controls['administrativeUnit'].setValue(undefined);
        }else{
          this.communes = data;
          this.formGroup.controls['administrativeUnit'].setValue(undefined);
        }
      })
    }
  }
}

export interface MatDialogData {
  provinces: AdministrativeUnit[];
  publisher: Publisher
}

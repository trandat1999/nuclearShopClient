import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseResponse} from "../../../dto/BaseResponse";
import {AdministrativeUnit} from "../../../dto/AdministrativeUnit.class";
import {Publisher} from "../../../dto/Publisher.class";
import {AdministrativeUnitService} from "../administrative-unit/adminstrative-unit.service";
import {Warehouse} from "../../../dto/Warehouse.class";
import {WarehouseService} from "./warehouse.service";

@Component({
  selector: 'warehouse-dialog-create',
  templateUrl: 'dialog-create.html',
})
export class DialogCreateWarehouse implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateWarehouse>,
    private toast: ToastrService,
    private loading: NgxSpinnerService,
    private api: WarehouseService,
    private translate: TranslateService,
    private administrativeUnitService: AdministrativeUnitService,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
  ) {
    this.provinces = data.provinces;
    this.entity = data.entity;
    if (!this.entity) {
      this.entity = new Warehouse();
    }
    if(this.entity.administrativeUnit?.parent?.parent){
      this.getByPrent(1,this.entity.administrativeUnit.parent.parent,false);
      this.entity.province = this.entity.administrativeUnit.parent.parent;
    }
    if(this.entity.administrativeUnit?.parent){
      this.getByPrent(2,this.entity.administrativeUnit.parent,false);
      this.entity.district = this.entity.administrativeUnit.parent;
    }
  }

  entity!: Warehouse;
  provinces: AdministrativeUnit[] = [];
  districts: AdministrativeUnit[] = [];
  communes: AdministrativeUnit[] = [];
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.intiForm();
  }

  private intiForm() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.entity.id),
      code: new FormControl(this.entity.code, [Validators.required]),
      name: new FormControl(this.entity.name, [Validators.required]),
      description: new FormControl(this.entity.description),
      province: new FormControl(this.entity.province, [Validators.required]),
      district: new FormControl(this.entity.district, [Validators.required]),
      phoneNumber: new FormControl(this.entity.phoneNumber,[Validators.pattern("((84|0|'+'84)[3|5|7|8|9])+([0-9]{8})")]),
      acreage: new FormControl(this.entity.acreage, [Validators.required,Validators.min(0)]),
      address: new FormControl(this.entity.address),
      administrativeUnit: new FormControl(this.entity.administrativeUnit, [Validators.required])
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
      if (field == "phoneNumber" && this.formGroup.controls['phoneNumber'].errors) {
        if (this.formGroup.controls['phoneNumber'].errors?.['pattern']) {
          return this.translate.instant("common.fieldInvalid");
        }
      }
      if (field == "acreage" && this.formGroup.controls['acreage'].errors) {
        if (this.formGroup.controls['acreage'].errors?.['required']) {
          return this.translate.instant("common.fieldRequired");
        }else if (this.formGroup.controls['acreage'].errors?.['min']) {
          return this.translate.instant("warehouse.acreageMinValid",{value :this.formGroup.controls['acreage'].errors?.['min'].min});
        }
      }
    }
    return "";
  }

  save(data: Warehouse) {
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
    if (this.entity.id) {
      this.update(this.formGroup.value, this.entity.id)
    } else {
      this.save(this.formGroup.value);
    }
  }

  getByPrent(type:number,item : AdministrativeUnit,clear : boolean){
    if(item && item.id){
      this.loading.show();
      this.administrativeUnitService.getAllByParent(item.id).subscribe(data =>{
        this.loading.hide();
        if(type==1){
          this.districts = data;
          if(clear){
            this.formGroup.controls['district'].setValue(undefined);
            this.formGroup.controls['administrativeUnit'].setValue(undefined);
          }
        }else{
          this.communes = data;
          if(clear){
            this.formGroup.controls['administrativeUnit'].setValue(undefined);
          }
        }
      })
    }
  }
}

export interface MatDialogData {
  provinces: AdministrativeUnit[];
  entity: Warehouse
}

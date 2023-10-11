import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderImport} from "../../../dto/OrderImport.class";
import {OrderImportService} from "../order-import/order-import.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseResponse} from "../../../dto/BaseResponse";
import {OrderImportStatus} from "../../../dto/enum/Enum.class";
import {Warehouse} from "../../../dto/Warehouse.class";
import {PublisherService} from '../publisher/publisher.service';
import {WarehouseService} from "../../manage/warehouse/warehouse.service";
import {Publisher} from "../../../dto/Publisher.class";
import {ProductService} from '../../manage/product/product.service';
import {Product} from "../../../dto/Product.class";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-order-import-edit',
  templateUrl: './order-import-edit.component.html',
  styleUrls: ['./order-import-edit.component.scss']
})
export class OrderImportEditComponent implements OnInit {
  entity!: OrderImport
  formGroup!: FormGroup
  isShowComponent = false;
  currentId?: number;
  statusOrderImport = OrderImportStatus;
  warehouses : Warehouse[] = [];
  publishers : Publisher[]=[];
  toDay = new Date();
  products: Product[] = [];
  editable = true;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: OrderImportService,
    private loading : NgxSpinnerService,
    private toast : ToastrService,
    private warehouseService: WarehouseService,
    private publisherService: PublisherService,
    private productService: ProductService,
  ) {
    this.currentId = this.activatedRoute.snapshot.params['id'];
    this.warehouseService.getAll().subscribe(data => {
      if(data?.body){
        this.warehouses = data.body;
      }
    });
    this.publisherService.getAll().subscribe(data => {
      if(data?.body){
        this.publishers = data.body;
      }
    });
  }
  ngOnInit(): void {
    this.productService.getAll().subscribe(data => {
      if(data?.body){
        this.products = data.body;
      }
    })
    if(this.currentId) {
      this.loading.show();
      this.service.get(this.currentId).subscribe(res => {
        this.loading.hide();
        if(res instanceof HttpErrorResponse){
          this.back();
        }
        let data = res as BaseResponse;
        this.entity = data.body;
        if(this.entity.status !="NEW"){
          this.editable = false;
        }
        this.intiForm();
      })
    }else{
      this.entity = {};
      this.intiForm();
    }
  }
  back(){
    this.router.navigate(['import/order-import']);
  }

  private intiForm() {
      this.formGroup = new FormGroup({
        id: new FormControl(this.entity.id),
        orderDate: new FormControl(this.entity.orderDate? new Date(this.entity.orderDate):null,[Validators.required]),
        staffOrder: new FormControl(this.entity.staffOrder,[Validators.required]),
        status: new FormControl({ value :this.entity.id?this.entity.status:"NEW", disabled:!this.entity.id},[Validators.required]),
        staffFinished: new FormControl(this.entity.staffFinished,),
        dateFinished: new FormControl(this.entity.dateFinished),
        warehouse : new FormControl(this.entity.warehouse),
        publisher : new FormControl(this.entity.publisher,[Validators.required]),
        products : new FormArray([],[Validators.required])
      },{validators: this.validWhenStatusFinish()})
      if(this.entity.products && this.entity.products.length > 0){
        for(let item of this.entity.products){
          this.productFormArray?.push(new FormGroup({
            id: new FormControl(item.id),
            product: new FormControl(item.product,[Validators.required]),
            price: new FormControl(item.price,[Validators.required]),
            quantity: new FormControl(item.quantity,[Validators.required])
          }))
        }
      }
    this.isShowComponent = true;
  }

  get productFormArray(){
    return this.formGroup.get('products') as FormArray;
  }
  getErrorMessage(field:string){
    return "";
  }
  validWhenStatusFinish(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const status = control.get('status')?.value;
      if (!status || status != 'FINISHED') {
        control.get('staffFinished')?.setErrors(null)
        control.get('dateFinished')?.setErrors(null)
        control.get('warehouse')?.setErrors(null)
        control.get('staffFinished')?.setValidators([])
        control.get('dateFinished')?.setValidators([])
        control.get('warehouse')?.setValidators([])
        return null;
      }
      control.get('staffFinished')?.setValidators([Validators.required])
      control.get('dateFinished')?.setValidators([Validators.required])
      control.get('warehouse')?.setValidators([Validators.required])
      return null;
    }

  }
  onSubmit(){
      this.service.saveOrUpdate(this.currentId,this.formGroup.getRawValue()).subscribe(data => {
        if(data instanceof HttpErrorResponse){
          return;
        }
        let rs = data as BaseResponse;
        if(rs.code ==200 || rs.code == 201){
          this.toast.success(this.translate.instant("common.success"),this.translate.instant("common.notification"));
          this.router.navigate(['/import/order-import']);
        } else if (rs && rs.body && rs.body) {
          Object.keys(rs.body).forEach(key => {
            this.formGroup.controls[key].setErrors({'serverError': true, 'serverErrorMess': rs.body[key]});
          });
          return;
        }
      })
  }
  onAddItem(){
    this.productFormArray.push(new FormGroup({
      id: new FormControl(null),
      product: new FormControl(null,[Validators.required]),
      price: new FormControl(null,[Validators.required,Validators.min(0)]),
      quantity: new FormControl(null,[Validators.required,Validators.min(1)])
    }))
  }
  deleteItem(index:number){
    this.productFormArray.removeAt(index);
  }
}

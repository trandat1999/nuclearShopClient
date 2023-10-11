import {Component, OnInit} from '@angular/core';
import {FileUploadService} from "../../../service/file-upload.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, of} from "rxjs";
import {BaseResponse} from 'src/app/dto/BaseResponse';
import {map} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ProfileService} from "../../../service/profile.service";
import {Person} from "../../../dto/Profile.class";
import {Gender} from "../../../dto/enum/Enum.class";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  breadcrumbs = [
    {link: null, text: 'breadcrumbs.profile'},
    {link: null, text: 'breadcrumbs.setting'},
  ]
  showComponent = false;
  person!: Person
  formEdit: FormGroup = new FormGroup({})
  genders = Gender
  constructor(
    private fileUpload: FileUploadService,
    private profileService: ProfileService,
    private toast: ToastrService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.profileService.getProfile().pipe(
      map((data) => {
        return data
      }), catchError((error) => {
        return of(false);
      })
    ).subscribe(data => {
      this.showComponent = true;
      let rs = data as BaseResponse
      this.person = rs.body;
      this.afterInit();
    })
  }

  afterInit(): void {
    this.formEdit = new FormGroup({
      birthDate: new FormControl(this.person.birthDate?new Date(this.person.birthDate):null, Validators.required),
      lastName: new FormControl(this.person.lastName, Validators.required),
      firstName: new FormControl(this.person.firstName, Validators.required),
      gender: new FormControl(this.person.gender, Validators.required),
      phoneNumber: new FormControl(this.person.phoneNumber, [Validators.pattern("((84|0|'+'84)[3|5|7|8|9])+([0-9]{8})")]),
      idNumber: new FormControl(this.person.idNumber),
      idNumberIssueBy: new FormControl(this.person.idNumberIssueBy),
      idNumberIssueDate: new FormControl(this.person.idNumberIssueDate),
      photoFile: new FormGroup({
        id: new FormControl(this.person.photoFile?.id),
        downloadUrl: new FormControl(this.person.photoFile?.downloadUrl),
      }),
      email: new FormControl(this.person.email, Validators.required),
    })
  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.fileUpload.upload(event.target.files[0]).pipe(
        map((data) => {
          return data;
        }),
        catchError((error) => {
          this.toast.error(this.translate.instant("common.commonError"), this.translate.instant("common.error"))
          return of(false)
        })
      ).subscribe(data => {
          if (data) {
            let baseResponse = data as BaseResponse;
            this.formEdit.controls["photoFile"].setValue( {id : baseResponse.body.id,downloadUrl : baseResponse.body.downloadUrl});
          }
        }
      );
    }
  }

  onSubmit() {
    if(!this.formEdit.errors){
      this.spinner.show();
      this.profileService.updateProfile(this.formEdit.value).pipe(
        map(response => {
          this.spinner.hide();
          return  response}),
        catchError(error => {
          this.spinner.hide();
          return of(false);
        })
      ).subscribe(data => {
        this.spinner.hide();
        this.toast.success(this.translate.instant("common.updateSuccess"),this.translate.instant("common.notification"))
        let rs = data as BaseResponse
        this.person = rs.body;
        this.afterInit()
      })
    }
  }

}

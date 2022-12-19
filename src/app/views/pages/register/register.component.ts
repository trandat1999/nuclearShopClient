import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseResponse} from "../../../dto/BaseResponse";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public responseSuccess : any;
  public formRegister : any;
  public registerValid = true;
  public registerRequest = {
    username: "",
    password: "",
    email: "",
    confirmPassword :"",
    confirmService : false
  }
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerValid = true;
    this.formRegister = this.formBuilder.group({
      username : new FormControl(this.registerRequest.username, Validators.required),
      email : new FormControl(this.registerRequest.email, [Validators.required, Validators.email]),
      password : new FormControl(this.registerRequest.password,
        [Validators.required, Validators.minLength(6)]),
      confirmPassword : new FormControl(this.registerRequest.confirmPassword,
        [Validators.required, Validators.minLength(6)]),
      confirmService : new FormControl(this.registerRequest.confirmPassword,
        [Validators.requiredTrue]),
    },{ validator: this.MatchingPasswords })
  }

  public onSubmit(): void {
      this.authService.register(this.formRegister.value).subscribe(data => {
        if(data && data.code === 200){
          this.registerValid = false;
          this.responseSuccess = data as BaseResponse;
          // this._router.navigateByUrl("/login");
        }else{
          if(data && data.body){
              Object.keys(data.body).forEach(key => {
                this.formRegister.controls[key].setErrors({'alreadyExist': true});
              });
            return;
          }
        }
      })
  }

  MatchingPasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    const currentErrors = control.get('confirmPassword')?.errors
    const confirmControl = control.get('confirmPassword')

    if (password !== confirmPassword && confirmPassword !== '') {
      confirmControl?.setErrors({...currentErrors, not_matching: true});
    } else {
      // @ts-ignore
      confirmControl?.setErrors(currentErrors)
    }
  }

  getErrors(key :String) {
    if(this.formRegister && key){
      if(key=="email" && this.formRegister.controls['email'].errors && (this.formRegister.controls['email'].touchend || this.formRegister.controls['email'].dirty)){
        if(this.formRegister.controls['email'].errors?.required){
          return "Email is required";
        }else if(this.formRegister.controls['email'].errors?.alreadyExist){
          return this.formRegister.controls['email'].value + " is already";
        }else if(this.formRegister.controls['email'].errors?.email){
          return this.formRegister.controls['email'].value + " is invalid email";
        }
      }
      if( key=="username" && this.formRegister.controls['username'].errors && (this.formRegister.controls['username'].touchend || this.formRegister.controls['username'].dirty)){
        if(this.formRegister.controls['username'].errors?.required){
          return "Username is required";
        }else if(this.formRegister.controls['username'].errors?.alreadyExist){
          return this.formRegister.controls['username'].value + " is already";
        }
      }
      if( key=="password" && this.formRegister.controls['password'].errors && (this.formRegister.controls['password'].touchend || this.formRegister.controls['password'].dirty)){
        if(this.formRegister.controls['password'].errors?.required){
          return "Password is required";
        }else if(this.formRegister.controls['password'].errors?.minlength){
          return "Password is required minLength 6 characters";
        }
      }
      if( key=="confirmPassword" && this.formRegister.controls['confirmPassword'].errors && (this.formRegister.controls['confirmPassword'].touchend || this.formRegister.controls['confirmPassword'].dirty)){
        if(this.formRegister.controls['confirmPassword'].errors?.required){
          return "ConfirmPassword is required";
        }else if(this.formRegister.controls['confirmPassword'].errors?.minlength){
          return "ConfirmPassword is required minLength 6 characters";
        }else if(this.formRegister.controls['confirmPassword'].errors?.not_matching){
          return "ConfirmPassword not matching the password";
        }
      }
    }
    return "";
  }
}

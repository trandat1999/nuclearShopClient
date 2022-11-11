import { Component, OnInit } from '@angular/core';
import {RegisterRequest} from "../../../dto/AuthRequest.class";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
  ) {

  }

  ngOnInit(): void {
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
      if(data){
        this._router.navigateByUrl("/login");
      }else{
        this.registerValid = false;
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
}

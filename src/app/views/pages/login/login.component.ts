import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {LoginRequest} from "../../../dto/AuthRequest.class";
import {NgxSpinnerService} from 'ngx-spinner';
import {AppSettings} from "../../../../../AppSettings";
import {ToastrService} from 'ngx-toastr';

declare var grecaptcha: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  public site_key = AppSettings.SITE_KEY;
  public loginValid = true;
  public loginRequest :LoginRequest= {
    username: "",
    password: "",
    recaptchaResponse: "",
  }
  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toast:ToastrService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
  }
  ngOnInit(): void {
    this.initReCaptcha()
  }

  ngOnDestroy(): void {
    this._destroySub$.next();
  }

  initReCaptcha() {
    setTimeout(()=> {
      if (typeof grecaptcha === 'undefined' || typeof grecaptcha.render === 'undefined') {
        this.initReCaptcha();
      } else {
        grecaptcha.render('captcha', {
          'sitekey': this.site_key
        });
      }
    }, 100);
  }

  public onSubmit(): void {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      this.toast.warning("Recaptcha not verified.","Warring")
      return;
    }
    this.loginRequest.recaptchaResponse = response;
    this.spinner.show();
    this.authService.login(this.loginRequest).subscribe(data => {
      this.spinner.hide();
      if(data){
        this._router.navigateByUrl("");
      }else{
        this.loginValid = false;
      }
      grecaptcha.reset();
    })
  }
}

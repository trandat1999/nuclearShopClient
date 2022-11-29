import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {LoginRequest} from "../../../dto/AuthRequest.class";
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  public loginValid = true;
  public loginRequest :LoginRequest= {
    username: "",
    password: ""
  }
  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroySub$.next();
  }
  public onSubmit(): void {
    this.spinner.show();
    this.authService.login(this.loginRequest).subscribe(data => {
      this.spinner.hide();
      if(data){
        this._router.navigateByUrl("");
      }else{
        this.loginValid = false;
      }
    })
  }
}

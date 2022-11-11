import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if(this.storageService.isLoggedIn()){
      this.router.navigate(["/home"]);
      return !this.storageService.isLoggedIn();
    }
    return !this.storageService.isLoggedIn();
  }

}

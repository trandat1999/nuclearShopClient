import {Injectable, NgZone} from "@angular/core";
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  isOutTime = false;
  isLogin = false;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private storage : StorageService,
    private toast: ToastrService
  ) {
    if(this.isUserLoggedIn()){
      this.isLogin=true;
    }
    this.lastAction(Date.now());
    this.check();
    this.initListener();
    this.initInterval();
  }

  getLastAction() : string {
    let item = localStorage.getItem('lastAction');
    if(item){
      return item;
    }
    return "";
  }

  lastAction(value : any) {
    localStorage.setItem('lastAction', JSON.stringify(value))
  }

  /**
   * start event listener
   */
  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  /**
   * time interval
   */
  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, 10000);
    })
  }

  /**
   * reset timer
   */
  reset() {
    this.lastAction(Date.now());
    this.isOutTime = false;
  }

  checkOutTime() {
    const now = Date.now();
    const timeLeft = parseInt(this.getLastAction()) + 15 * 60 * 1000;
    const diff = timeLeft - now;
    return diff < 0;
  }
  /**
   * check timer
   */
  check() {
    this.ngZone.run(() => {
      if (this.checkOutTime() && this.isLogin && !this.isOutTime) {
        this.isOutTime = true;
        this.toast.warning("Bạn đã không hoạt động trong thời gian dài hệ thống sẽ đăng xuất sau 10 giây","Cảnh báo");
        setTimeout(()=>{
          if (this.checkOutTime() && this.isLogin){
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },10000);
      }
    });
  }
  isUserLoggedIn():boolean{
    return this.storage.isLoggedIn();
  }
}

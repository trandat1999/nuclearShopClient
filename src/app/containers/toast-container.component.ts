import {Component, TemplateRef} from "@angular/core";
import {ToastService} from "../service/toast-service";

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  host: {class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200'},
})
export class ToastContainer {

  constructor(public toastService: ToastService) {
  }

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }

}

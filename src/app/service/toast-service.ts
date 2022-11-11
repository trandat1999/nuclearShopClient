import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, title : string, options: any = {}) {
    this.toasts.push({ textOrTpl,title, ...options });
  }

  remove(toast : any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  showSuccess(message: string, title: string) {
    this.show(message,title, { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(message: string, title: string) {
    this.show(message, title,{ classname: 'bg-danger text-light', delay: 15000 });
  }
}

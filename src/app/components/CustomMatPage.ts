
import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class CustomMatPaginator extends MatPaginatorIntl {
  constructor(private translateService: TranslateService) {
    super();
    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
      this.itemsPerPageLabel = this.translateService.instant("paginator.itemsPerPageLabel");
      this.nextPageLabel = this.translateService.instant("paginator.nextPageLabel");
      this.previousPageLabel = this.translateService.instant("paginator.previousPageLabel");
      this.changes.next();

  }

  override getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}

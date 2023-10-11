import { AfterViewInit, Directive, DoCheck, Host, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";

@Directive({
  selector: '[stylePaginator]'
})
export class StylePaginatorDirective implements AfterViewInit, DoCheck {
  public currentPage = 1;
  public directiveLoaded = false;
  public pageGapTxt = '...';

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private readonly vr: ViewContainerRef,
    private readonly ren: Renderer2,
  ) {}

  private buildPageNumbers(pageCount, pageRange) {
    const paglast = pageCount;
    const pagcurrent = this.matPag.pageIndex;
    const rangeStart = Math.max(pagcurrent - 1, 0);
    const rangeEnd = Math.min(paglast - 1, pagcurrent + 1);

    for (let i = 0; i < paglast; i++) {
      if (i >= rangeStart && i <= rangeEnd) {
        this.ren.insertBefore(
          pageRange,
          this.createPage(i, this.matPag.pageIndex),
          null
        );
      } else if (i === rangeEnd + 1 && rangeEnd < paglast - 1) {
        this.ren.insertBefore(
          pageRange,
          this.createPage(this.pageGapTxt, rangeEnd),
          null
        );
      }
    }
  }

  private createPage(i: any, pageIndex: number): any {
    const linkBtn = this.ren.createElement('mat-button');
    this.ren.addClass(linkBtn, 'mat-icon-button');
    const pagingTxt = isNaN(i) ? this.pageGapTxt : +(i + 1);
    const text = this.ren.createText( pagingTxt + '');
    this.ren.addClass(linkBtn, 'mat-custom-page');

    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        this.ren.setStyle(linkBtn,"font-weight","bold")
        this.ren.setAttribute(linkBtn, 'color',"primary");
        break;
      case this.pageGapTxt:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        this.ren.setStyle(linkBtn,"font-weight","bold")
        this.ren.setAttribute(linkBtn, 'color',"primary");
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.currentPage = i;
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    return linkBtn;
  }
  private initPageRange(): void {
    const pagingContainerMain = this.vr.element.nativeElement.querySelector('.mat-paginator-range-actions');

    if (
      this.vr.element.nativeElement.querySelector('div.mat-paginator-range-actions div.btn_custom-paging-container')
    ) {
      this.ren.removeChild(
        pagingContainerMain,
        this.vr.element.nativeElement.querySelector('div.mat-paginator-range-actions div.btn_custom-paging-container'),
      );
    }

    const pagingContainerBtns = this.ren.createElement('div');
    const refNode = this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2].childNodes[5];
    this.ren.addClass(pagingContainerBtns, 'btn_custom-paging-container');
    this.ren.insertBefore(pagingContainerMain, pagingContainerBtns, refNode);

    const pageRange = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions div.btn_custom-paging-container',
    );
    pageRange.innerHTML = '';
    const pageCount = this.pageCount(this.matPag.length, this.matPag.pageSize);
    this.buildPageNumbers(pageCount, pageRange);
  }

  private pageCount(length: number, pageSize: number): number {
    return Math.ceil(length / pageSize);
  }

  private switchPage(i: number): void {
    this.matPag.pageIndex = i;
    this.matPag._changePageSize(this.matPag.pageSize);
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.directiveLoaded = true;
    }, 500);
  }

  public ngDoCheck() {
    if (this.directiveLoaded) {
      this.initPageRange();
    }
  }
}

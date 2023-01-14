import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order-import-edit',
  templateUrl: './order-import-edit.component.html',
  styleUrls: ['./order-import-edit.component.scss']
})
export class OrderImportEditComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentId = params['id'];
    });
  }
  currentId?: number;

  ngOnInit(): void {
  }
  back(){
    this.router.navigate(['import/order-import']);
  }

}

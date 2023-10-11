import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ImportExcelResponse} from "../../dto/BaseResponse";

@Component({
  selector: 'app-upload-excel-dialog',
  templateUrl: './upload-excel-dialog.component.html',
  styleUrls: ['./upload-excel-dialog.component.scss']
})
export class UploadExcelDialogComponent implements OnInit {
  importExcelResponse!: ImportExcelResponse
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImportExcelResponse,
    public dialogRef: MatDialogRef<UploadExcelDialogComponent>
  ) {
    this.importExcelResponse = data;
  }

  ngOnInit(): void {
  }
}

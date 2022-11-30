import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent {

  @Output() save = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(0);
  }

  confirmDelete() {
    this.save.emit(true);
  }
}

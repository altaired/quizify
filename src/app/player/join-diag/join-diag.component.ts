import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {  FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-join-diag',
  templateUrl: './join-diag.component.html',
  styleUrls: ['./join-diag.component.scss']
})
export class JoinDiagComponent implements OnInit {

  form: FormGroup;
  name:string = "";
  gameCode:string = "";
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JoinDiagComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {  }

    ngOnInit() {
      this.form = this.fb.group({
          name: this.name,
          gameCode: this.gameCode
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close(this.form.value);
}
close() {
  this.dialogRef.close();
}
}

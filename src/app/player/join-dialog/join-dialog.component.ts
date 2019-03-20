import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss']
})
export class JoinDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gameCode: ['', Validators.required],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  close() {
    this.dialogRef.close();
  }
}

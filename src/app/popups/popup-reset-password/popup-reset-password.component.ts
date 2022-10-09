import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-reset-password',
  templateUrl: './popup-reset-password.component.html',
  styleUrls: ['./popup-reset-password.component.scss']
})
export class PopupResetPasswordComponent implements OnInit {

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public mail: String,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}

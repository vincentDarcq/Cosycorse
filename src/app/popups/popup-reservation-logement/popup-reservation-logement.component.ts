import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogementReservation } from '../../models/logementReservation';

@Component({
  selector: 'app-popup-reservation-logement',
  templateUrl: './popup-reservation-logement.component.html',
  styleUrls: ['./popup-reservation-logement.component.scss']
})
export class PopupReservationLogementComponent implements OnInit{

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupReservationLogementComponent>,
    @Inject(MAT_DIALOG_DATA) public logementReservation: LogementReservation,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      emailDemandeur: ['', [Validators.required, Validators.email]],
      message: ''
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

}

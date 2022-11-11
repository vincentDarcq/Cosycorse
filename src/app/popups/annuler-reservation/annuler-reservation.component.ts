import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonCompteReservation } from 'src/app/models/monCompteReservation';

@Component({
  selector: 'app-annuler-reservation',
  templateUrl: './annuler-reservation.component.html',
  styleUrls: ['./annuler-reservation.component.scss']
})
export class AnnulerReservationComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AnnulerReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public mcr: MonCompteReservation,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      message: ['', Validators.required]
    })
  }

  submit(){
    this.dialogRef.close(this.form.value.message);
  }

  cancel(){
    this.dialogRef.close();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogementReservation } from 'src/app/models/logementReservation';

@Component({
  selector: 'app-annuler-reservation',
  templateUrl: './annuler-reservation.component.html',
  styleUrls: ['./annuler-reservation.component.scss']
})
export class AnnulerReservationComponent implements OnInit {

  message: string = "";

  constructor(
    public dialogRef: MatDialogRef<AnnulerReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public mail: LogementReservation
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close();
  }

  submit(){
    this.dialogRef.close(this.message);
  }

}

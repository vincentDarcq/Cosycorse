import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogementReservation } from '../../models/logementReservation';

@Component({
  selector: 'app-popup-reservation-logement',
  templateUrl: './popup-reservation-logement.component.html',
  styleUrls: ['./popup-reservation-logement.component.scss']
})
export class PopupReservationLogementComponent {

  constructor(public dialogRef: MatDialogRef<PopupReservationLogementComponent>,
    @Inject(MAT_DIALOG_DATA) public logementRservation: LogementReservation) { }

  cancel(): void {
    this.dialogRef.close();
  }

}

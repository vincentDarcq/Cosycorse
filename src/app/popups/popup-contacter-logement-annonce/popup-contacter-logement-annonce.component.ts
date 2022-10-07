import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailContactLogement } from '../../models/mailContactLogement';

@Component({
  selector: 'app-popup-contacter-logement-annonce',
  templateUrl: './popup-contacter-logement-annonce.component.html',
  styleUrls: ['./popup-contacter-logement-annonce.component.scss']
})
export class PopupContacterLogementAnnonceComponent {

  constructor(public dialogRef: MatDialogRef<PopupContacterLogementAnnonceComponent>,
    @Inject(MAT_DIALOG_DATA) public mail: MailContactLogement) { }

  cancel(): void {
    this.dialogRef.close();
  }

}

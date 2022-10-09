import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailContactLogement } from '../../models/mailContactLogement';

@Component({
  selector: 'app-popup-contacter-logement-annonce',
  templateUrl: './popup-contacter-logement-annonce.component.html',
  styleUrls: ['./popup-contacter-logement-annonce.component.scss']
})
export class PopupContacterLogementAnnonceComponent implements OnInit{

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupContacterLogementAnnonceComponent>,
    @Inject(MAT_DIALOG_DATA) public mail: MailContactLogement,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      from: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(){
    this.dialogRef.close(this.form.value);
  }

}

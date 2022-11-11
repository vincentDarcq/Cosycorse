import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-annuler-reservation',
  templateUrl: './annuler-voyage.component.html',
  styleUrls: ['./annuler-voyage.component.scss']
})
export class AnnulerVoyageComponent implements OnInit {

  message: string = "";

  constructor(
    public dialogRef: MatDialogRef<AnnulerVoyageComponent>
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

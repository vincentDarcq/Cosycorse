import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotifRequestCosyCorse } from '../models/motifRequestCosyCorse';
import { RequestCosycorse } from '../models/requestCosycorse';
import { ContactService } from '../services/contact.service';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  formRequest: FormGroup;
  message: string;
  motifs = MotifRequestCosyCorse;
  motifRequest: string;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private infoService: InfoService
    ) { }

  ngOnInit(): void {
    this.formRequest = this.formBuilder.group({
      motifRequest: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    })
  }

  submitRequest(){
    const request = new RequestCosycorse(
      this.formRequest.value.motifRequest, 
      this.formRequest.value.mail,
      this.formRequest.value.message
    );
    this.contactService.sendRequestCosycorse(request).subscribe(
      (result: string) => {
        this.infoService.popupInfo(result);
      },
      err => {
        this.infoService.popupInfo(`Une erreur s'est produite : ${err.error}`)
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StripeService } from '../services/stripe.service';

@Component({
  selector: 'app-stripe-redirect',
  templateUrl: './stripe-redirect.component.html',
  styleUrls: ['./stripe-redirect.component.scss']
})
export class StripeRedirectComponent implements OnInit {

  code!: string;
  response!: any;
  erreur: string = "";
  public subActivatedRoute?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.code = params['code'];
      this.stripeService.finalizeSetUpPaiement(this.code).subscribe(
        res => {
        if (res && res.status === 'ok') {
          this.response = res;
        }},
        err => this.erreur = err);
    })
  }

}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StripeService } from 'src/app/services/stripe.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-paiement-stripe',
  templateUrl: './paiement-stripe.component.html',
  styleUrls: ['./paiement-stripe.component.scss']
})
export class PaiementStripeComponent implements OnInit, AfterViewInit {

  publishableKey!: string;
  stripe: Stripe;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<PaiementStripeComponent>,
    private stripeService: StripeService
  ) { }
  
  ngOnInit(): void {    
  }
  
  ngAfterViewInit(): void {
    this.stripeService.getConfig().subscribe(async res => {
      this.publishableKey = res.publishableKey;
      this.stripe = await loadStripe(this.publishableKey);
      const style = { // input card style optional
        base: {
            fontSize: '16px',
            color: '#32325d',
        },
      };
      
      const elements = this.stripe.elements();
      const card = elements.create('card', {
        style
      });
      card.mount(this.cardInfo.nativeElement);
    });
  }
  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close();
  }

}

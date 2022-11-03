import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StripeService } from 'src/app/services/stripe.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
declare let Stripe: any;

@Component({
  selector: 'app-paiement-stripe',
  templateUrl: './paiement-stripe.component.html',
  styleUrls: ['./paiement-stripe.component.scss']
})
export class PaiementStripeComponent implements OnInit, AfterViewInit, OnDestroy {

  publishableKey: string;
  stripe;
  card;
  public subUser: Subscription;
  public user: User;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<PaiementStripeComponent>,
    private stripeService: StripeService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public datas: any
  ) { }
  
  ngOnInit(): void {  
    this.subUser = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    })  
  }
  
  ngAfterViewInit(): void {
    this.stripeService.getConfig().subscribe(async res => {
      this.publishableKey = res.publishableKey;
      this.stripe = Stripe(this.publishableKey);
      const style = { // input card style optional
        base: {
          fontSize: '16px',
          color: '#32325d',
        },
      };
      
      const elements = this.stripe.elements();
      this.card = elements.create('card', {
        style
      });
      this.card.mount(this.cardInfo.nativeElement);
    });
  }
  cancel(): void {
    this.dialogRef.close();
  }
  
  async submit() {
    const payment = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        email: this.user.email,
        name: `${this.user.prenom} ${this.user.nom}`,
      },
    });
    const { clientSecret } = await this.stripeService.createPaiementIntent(
      this.user._id,
      this.datas.logement._id, 
      this.datas.logementReservation.nuits, 
      payment.paymentMethod.id
    ).toPromise()
    this.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: this.card },
      }
    )
    this.dialogRef.close(payment.paymentMethod.id);
  }
  
  ngOnDestroy(): void {
    if (this.subUser) { this.subUser.unsubscribe() }
  }
}

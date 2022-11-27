import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Logement } from 'src/app/models/logement';
import { User } from 'src/app/models/user.model';
import { StripeService } from 'src/app/services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { LogementReservation } from '../../models/logementReservation';
declare let Stripe: any;

@Component({
  selector: 'app-popup-reservation-logement',
  templateUrl: './popup-reservation-logement.component.html',
  styleUrls: ['./popup-reservation-logement.component.scss']
})
export class PopupReservationLogementComponent implements OnInit, AfterViewInit, OnDestroy{

  form: FormGroup;
  public subUser: Subscription;
  public subStripe: Subscription;
  public user: User;
  publishableKey: string;
  stripe: any;
  card: any;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PopupReservationLogementComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: {logementReservation: LogementReservation, logement: Logement},
    private formBuilder: FormBuilder,
    private userService: UserService,
    private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    this.subUser = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    }) 
    this.form = this.formBuilder.group({
      emailDemandeur: ['', [Validators.required, Validators.email]],
      message: ''
    });
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
        hidePostalCode: true,
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
    this.datas.logementReservation.pm = payment.paymentMethod.id;
    const { clientSecret, paymentIntentId } = await this.stripeService.createPaiementIntent(
      this.user._id,
      this.datas.logement._id, 
      this.datas.logementReservation.nuits, 
      payment.paymentMethod.id
    ).toPromise();
    this.datas.logementReservation.pi = paymentIntentId;
    this.stripe.confirmCardPayment(clientSecret);
    this.dialogRef.close({
      logementReservation: this.datas.logementReservation,
      form: this.form.value
    });
  }

  ngOnDestroy(): void {
    if (this.subUser) { this.subUser.unsubscribe() }
  }

}

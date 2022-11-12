import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { StripeService } from '../../services/stripe.service';

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
    private stripeService: StripeService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.code = params['code'];
      this.stripeService.finalizeSetUpPaiement(this.code).subscribe(
        async res => {
        if (res && res.status === 'ok') {
          this.userService.getCurrentUser();
          while(!this.userService.currentUser.value.stripeUserId){
            await new Promise(f => setTimeout(f, 100));
          }
          this.router.navigate(['/mon_compte'])
        }},
        err => this.erreur = err);
    })
  }

}

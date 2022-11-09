import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementReservation } from '../models/logementReservation';
import { MonCompteReservation } from '../models/monCompteReservation';
import { User } from '../models/user.model';
import { AnnulerReservationComponent } from '../popups/annuler-reservation/annuler-reservation.component';
import { InfoService } from '../services/info.service';
import { LogementService } from '../services/logement.service';
import { StripeService } from '../services/stripe.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.scss']
})
export class MonCompteComponent implements OnInit, OnDestroy {

  public subUser!: Subscription;
  public subReservations!: Subscription;
  public user!: User;
  monCompteReservations: Array<MonCompteReservation> = [];
  serverImg: String = "/upload?img=";

  constructor(
    private userService: UserService,
    private logementService: LogementService,
    private stripeService: StripeService,
    private dialog: MatDialog,
    private infoService: InfoService
  ) { }
  
  ngOnInit(): void {
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    this.subUser = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
      if(user?.stripeUserId){
        this.user.stripeUserId = user?.stripeUserId;
      }
      this.subReservations = this.logementService.getReservationsByUserEmail(this.user.email).subscribe((logementReservations: Array<LogementReservation>) => {
        logementReservations.forEach(lr => {
          this.logementService.fetchLogementById(lr.logementId!).subscribe( (logement: Logement) => {
            logement.indexImage = 0;
            this.monCompteReservations.push(new MonCompteReservation(lr, logement));
          })
        })
      })
    })
  }

  selectArrow(mcr: Array<MonCompteReservation>, mcrIndex: number, index: number) {
    if (index < (this.monCompteReservations[mcrIndex].logement.images!.length - 1)) {
      mcr[mcrIndex].logement.indexImage++;
    }
  }

  selectLeftArrow(logements: Array<MonCompteReservation>, mcrIndex: number, index: number) {
    if (index > 0) {
      logements[mcrIndex].logement.indexImage--;
    }
  }

  annulerReservation(monCompteReservation: MonCompteReservation, index: number){
    const dialogRef = this.dialog.open(AnnulerReservationComponent, {
      width: '450px',
      data: monCompteReservation,
    });
    dialogRef.afterClosed().subscribe( message => {
      console.log(message)
      if(typeof message !== 'undefined'){
        this.logementService.cancelLogementReservation(monCompteReservation, message).subscribe( 
          mess => {
            this.monCompteReservations.splice(index, 1);
            this.infoService.popupInfo(mess);
          }),
          err => {
            this.infoService.popupInfo(err);
          }
      }
    })
  }

  linkToStripe(){
    this.stripeService.getStripeLink(this.user.stripeUserId).subscribe((result: any) => {
      window.open(result.url);
    })
  }

  setUpPaiementStripe(){
    this.stripeService.setUpPaiement(this.user._id).subscribe((url: any) => {
      window.open(url.location);
    });
  }
  
  ngOnDestroy(): void {
    if(this.subUser){this.subUser.unsubscribe();}
    if(this.subReservations){this.subReservations.unsubscribe();}
  }
}

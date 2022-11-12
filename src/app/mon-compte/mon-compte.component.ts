import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementReservation } from '../models/logementReservation';
import { MonCompteReservation } from '../models/monCompteReservation';
import { MonCompteVoyage } from '../models/monCompteVoyage';
import { User } from '../models/user.model';
import { AnnulerReservationComponent } from '../popups/annuler-reservation/annuler-reservation.component';
import { AnnulerVoyageComponent } from '../popups/annuler-voyage/annuler-voyage.component';
import { InfoService } from '../services/info.service';
import { LogementService } from '../services/logement.service';
import { StripeService } from '../services/stripe.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { RouterExtService } from '../services/router-ext.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.scss']
})
export class MonCompteComponent implements OnInit, OnDestroy {

  public subUser: Subscription;
  public subMonCompte: Subscription;
  public subLogementService: Subscription;
  public user: User;
  mesVoyages: Array<MonCompteVoyage> = [];
  mesReservations: Array<MonCompteReservation> = [];
  serverImg: String = "/upload?img=";

  constructor(
    private userService: UserService,
    private logementService: LogementService,
    private stripeService: StripeService,
    private dialog: MatDialog,
    private infoService: InfoService,
    private routerExt: RouterExtService
  ) { }
  
  async ngOnInit() {
    const previousUrl = this.routerExt.getPreviousUrl();
    if(previousUrl.startsWith('/stripe/redirect')){
      this.infoService.popupInfo("Votre compte Stripe a bien été configuré");
    }
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    while(!this.userService.currentUser.value._id){
      await new Promise(f => setTimeout(f, 100));
    }
    this.subUser = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
      if(user.stripeUserId){
        this.user.stripeUserId = user.stripeUserId;
      }
      this.subMonCompte = this.logementService.getReservationsByDemandeurEmail(this.user.email).subscribe((logementReservations: Array<LogementReservation>) => {
        logementReservations.forEach(lr => {
          this.logementService.fetchLogementById(lr.logementId).subscribe( (logement: Logement) => {
            this.userService.getUserByMail(lr.emailDemandeur).subscribe((user: any) => {
              const mcr = new MonCompteReservation(logement, lr, new User(user._id, user.email, user.firstName, user.lastName));
              this.mesReservations.push(mcr);
            });
            logement.indexImage = 0;
            this.mesVoyages.push(new MonCompteVoyage(lr, logement));
          })
        })
      });
    })
  }

  selectArrow(mcr: Array<MonCompteVoyage>, mcrIndex: number, index: number) {
    if (index < (this.mesVoyages[mcrIndex].logement.images!.length - 1)) {
      mcr[mcrIndex].logement.indexImage++;
    }
  }

  selectLeftArrow(logements: Array<MonCompteVoyage>, mcrIndex: number, index: number) {
    if (index > 0) {
      logements[mcrIndex].logement.indexImage--;
    }
  }

  acceptReservation(id: string, user: User){
    Swal.fire({
      title: `Accepter la reservation de ${user.prenom} ${user.nom} ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {        
        this.subLogementService = this.logementService.confirmLogementReservation(id).subscribe( 
          (rep: string) => {
            let index = this.mesReservations.findIndex(mr => mr.logementReservation._id === id);
            this.mesReservations[index].logementReservation.status = "acceptée";
            this.infoService.popupInfo(rep);
          }
        )
      }
    });
  }

  rejectReservation(id: string, user: User){
    Swal.fire({
      title: `Refuser la reservation de ${user.prenom} ${user.nom} ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {        
        this.subLogementService = this.logementService.rejectLogementReservation(id).subscribe(
          (rep: string) => {
            let index = this.mesReservations.findIndex(mr => mr.logementReservation._id === id);
            this.mesReservations[index].logementReservation.status = "refusée";
            this.infoService.popupInfo(rep);
          }
        )
      }
    }); 
  }

  annulerVoyage(monCompteVoyage: MonCompteVoyage, index: number){
    const dialogRef = this.dialog.open(AnnulerVoyageComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe( message => {
      if(typeof message !== 'undefined'){
        this.logementService.cancelLogementReservationVoyageur(monCompteVoyage, message).subscribe( 
          mess => {
            this.mesVoyages.splice(index, 1);
            this.infoService.popupInfo(mess);
          },
          err => {
            this.infoService.popupInfo(err);
          }
        )
      }
    })
  }

  annulerReservation(monCompteReservation: MonCompteReservation, index: number){
    const dialogRef = this.dialog.open(AnnulerReservationComponent, {
      width: '450px',
      data: monCompteReservation,
    });
    dialogRef.afterClosed().subscribe( message => {
      if(typeof message !== 'undefined'){
        if(message.length > 0){
          this.logementService.cancelLogementReservationHote(monCompteReservation, message).subscribe( 
            mess => {
              this.mesReservations.splice(index, 1);
              this.infoService.popupInfo(mess);
            },
            err => {
              this.infoService.popupInfo(err.error);
            }
          );
        }else {
          this.infoService.popupInfo("Votre message était vide, l'annulation n'a pas abouti");
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
    if(this.subMonCompte){this.subMonCompte.unsubscribe();}
    if(this.subLogementService){this.subLogementService.unsubscribe();}
  }
}

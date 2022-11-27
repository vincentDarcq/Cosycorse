import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Subscription } from 'rxjs';
import { galleryImage } from '../models/galleryImage';
import { galleryOptions } from '../models/galleryOptons';
import { Logement } from '../models/logement';
import { LogementService } from '../services/logement.service';
import { Equipements } from '../models/equipements';
import { EquipementsSecurite } from '../models/equipementsSecurite';
import { MailsService } from '../services/mails.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupContacterLogementAnnonceComponent } from '../popups/popup-contacter-logement-annonce/popup-contacter-logement-annonce.component';
import { MailContactLogement } from '../models/mailContactLogement';
import { LogementReservation } from '../models/logementReservation';
import { PopupReservationLogementComponent } from '../popups/popup-reservation-logement/popup-reservation-logement.component';
import { InfoService } from '../services/info.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.scss']
})
export class LogementComponent implements OnInit, OnDestroy {

  public logement: Logement;
  public subActivatedRoute: Subscription;
  public subLogements: Subscription;
  public subUser: Subscription;
  id: string = "";
  serverImg: String = "/upload?img=";
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;
  equipements: Array<any> = [];
  dateDebut: Date;
  dateFin: Date;
  todayDate: Date = new Date(Date.now());
  calendarMaxDate: Date = new Date(8640000000000000);
  maxDate: Date = this.calendarMaxDate;
  datesUnavailable = new Array<Date>();
  mail: MailContactLogement = new MailContactLogement();
  prixTotal: number;
  public user: User;

  constructor(
    private authentService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService,
    private mailsService: MailsService,
    private dialog: MatDialog,
    private infoService: InfoService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    this.subUser = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    })
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      this.subLogements = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
        if (logements.length > 0) {
          this.logement = this.logementService.getLogementById(this.id);
        }
        if (typeof this.logement === "undefined") {
          this.logementService.fetchLogementById(this.id).subscribe((logement: Logement) => {
            this.logement = logement;
            this.completeLogement();
            this.getReservations();
          });
        } else {
          this.completeLogement();
          this.getReservations();
        }
      });
    });
  }

  getReservations(){
    this.logementService.getReservationsByLogementId(this.logement._id).subscribe( (reservations: Array<LogementReservation>) => {
      reservations.forEach(res => {
        if(res.status !== "annulée" && res.status !== "refusée"){
          const dd = res.dateDebut.split("/");
          const df = res.dateFin.split("/");
          const dateFin = df[1] + "-" + df[0] + "-" + df[2];
          const dateDebut = dd[1] + "-" + dd[0] + "-" + dd[2];
          const nuits = this.getNbNuits(new Date(dateFin), new Date(dateDebut));
          for(let i = 0; i < nuits; i++){
            this.datesUnavailable.push(new Date(new Date(dateDebut).getTime() + i*(1000 * 60 * 60 * 24)))
          }
        }
      })
    })
  }

  completeLogement() {
    this.logement.galleryImages = [];
    this.logement.images.forEach(image => {
      this.logement.galleryImages?.push(new galleryImage(this.serverImg + image, this.serverImg + image, this.serverImg + image))
    })
    this.logement.equipements.forEach(equipement => {
      let eq = this.equipementsList.find(e => e.element === equipement);
      if (typeof eq === "undefined") {
        eq = this.equipementsSecuriteList.find(e => e.element === equipement);
      }
      this.equipements.push(eq);
    })
  }

  filterDates = (d: Date | null): boolean => {
    if(new Date(Date.now()).getTime() > d.getTime() || !this.logement.exposer){
      return false;
    }
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    let available = true;
    if(this.dateDebut && d.getTime() < this.dateDebut.getTime()){
      available = false;
    }
    for(let i = 0; i < this.datesUnavailable.length; i++){
      if (day === this.datesUnavailable[i].getDate()+1 && month === this.datesUnavailable[i].getMonth() && year === this.datesUnavailable[i].getFullYear()) {
        available = false;
        break;
      }
    }
    return available;
  }

  startDateChanged(e: any) {
    const date = e.value;
    if (date) {
      const dateTime = date.getTime();
      for (let i = 0; i < this.datesUnavailable.length; i++) {
        if (dateTime <= this.datesUnavailable[i].getTime()) {
          this.maxDate = this.datesUnavailable[i];
          break;
        }
      }
    } else {
      this.maxDate = this.calendarMaxDate;
    }
  }
  
  endDateChanged(){
    if(this.dateDebut && this.dateFin){
      const time = this.dateFin.getTime() - this.dateDebut.getTime();
      const nights = Math.floor((time / 1000) / 3600) / 24;
      this.prixTotal = nights * (this.logement.prix + (this.logement.prix * 10/100));
    }
  }

  openFormContact() {
    const dialogRef = this.dialog.open(PopupContacterLogementAnnonceComponent, {
      width: '450px',
      data: new MailContactLogement(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.mail.message = result.message;
        this.mail.from = result.from;
        this.mail.to = this.logement.emailAnnonceur;
        this.mail.subject = this.logement.ville + " " + this.logement.adresse;
        this.mailsService.contactHost(this.mail).subscribe(
          res => {
            this.infoService.popupInfo("mail envoyé avec succès");
          },
          err => {
            this.infoService.popupInfo("Une erreur s'est produite lors de l'envoi du mail : "+err.error);
          })
      }
    });
  }

  clearSelection() {
    this.dateDebut = this.dateFin = undefined;
    this.maxDate = this.calendarMaxDate;
    this.prixTotal = undefined;
  }

  schedule() {
    if(typeof this.user.email === 'undefined'){
      const path = `logement/${this.logement._id}`;
      sessionStorage.setItem('redirectUrl', path);
      this.router.navigate(['/connexion']);
    }else if(this.dateFin === null || this.dateDebut === null){
      this.infoService.popupInfo("Les dates séléctionnées sont invalides");
      return;
    }else if(!this.logement.exposer){
      this.infoService.popupInfo("Vous ne pouvez pas faire de réservation pour ce logement");
      return;
    }else {
      let logementReservation : LogementReservation = new LogementReservation();
      const nuits = this.getNbNuits(this.dateFin, this.dateDebut);
      if(nuits === 0){
        this.infoService.popupInfo("La date d'arrivée ne peut pas être la même que la date de départ");
        return;
      }
      logementReservation.nuits = nuits;
      logementReservation.prix = this.prixTotal = nuits * (this.logement.prix + (this.logement.prix * 10/100));
      logementReservation.emailAnnonceur = this.logement.emailAnnonceur;
      const dayDebut = this.dateDebut.getDate().toString().length === 1 ? "0"+this.dateDebut.getDate() : this.dateDebut.getDate();
      const dayFin = this.dateFin.getDate().toString().length === 1 ? "0"+this.dateFin.getDate() : this.dateFin.getDate();
      const monthDebut = this.dateDebut.getMonth().toString().length === 1 ? "0"+this.dateDebut.getMonth()+1 : this.dateDebut.getMonth()+1;
      const monthFin = this.dateFin.getMonth().toString().length === 1 ? "0"+this.dateFin.getMonth()+1 : this.dateFin.getMonth()+1;
      logementReservation.dateDebut = dayDebut + "/" + monthDebut + "/" + this.dateDebut.getFullYear();
      logementReservation.dateFin = dayFin + "/" + monthFin + "/" + this.dateFin.getFullYear();
      logementReservation.logementId = this.logement._id;
      const dialogRef = this.dialog.open(PopupReservationLogementComponent, {
        width: '450px',
        data: {logementReservation: logementReservation, logement: this.logement},
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          logementReservation.emailDemandeur = result.form.emailDemandeur;
          logementReservation.message = result.form.message;
          this.authentService.getTokenForReservation().subscribe( (token: string) => {
            sessionStorage.setItem('token', token);
            this.logementService.reserverLocation(logementReservation).subscribe( 
              (res: string) => {
                sessionStorage.removeItem('token');
                this.infoService.popupInfo(res);
              },
              err => {
                sessionStorage.removeItem('token');
                this.infoService.popupInfo(err.error);
              })
          })
        }
      });
    }
  }

  getNbNuits(dateFin: Date, dateDebut: Date): number {
    const time = dateFin.getTime() - dateDebut.getTime();
    return Math.floor((time / 1000) / 3600) / 24;
  }

  ngOnDestroy(): void {
    if (this.subActivatedRoute) { this.subActivatedRoute.unsubscribe() }
    if (this.subLogements) { this.subLogements.unsubscribe() }
  }
}

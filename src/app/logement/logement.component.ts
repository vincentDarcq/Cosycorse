import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import Swal from 'sweetalert2';
import { LogementReservation } from '../models/logementReservation';
import { PopupReservationLogementComponent } from '../popups/popup-reservation-logement/popup-reservation-logement.component';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.scss']
})
export class LogementComponent implements OnInit, OnDestroy {

  public logement?: Logement;
  public subActivatedRoute?: Subscription;
  public subLogements?: Subscription;
  id: string = "";
  serverImg: String = "/upload?img=";
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;
  equipements: Array<any> = [];
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  todayDate: Date = new Date(Date.now());
  calendarMaxDate: Date = new Date(8640000000000000);
  maxDate: Date = this.calendarMaxDate;
  datesUnavailable = new Array();
  mail: MailContactLogement = new MailContactLogement();
  prixTotal?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService,
    private mailsService: MailsService,
    private dialog: MatDialog,
    private infoService: InfoService
  ) {
  }

  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      this.subLogements = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
        if (logements.length > 0) {
          this.logement = this.logementService.getLogementById(this.id!);
          if (typeof this.logement === "undefined") {
            this.logementService.fetchLogementById(this.id).subscribe((logement: Logement) => {
              this.logement = logement;
              this.completeLogement();
              this.getReservations();
            })
          } else {
            this.completeLogement();
            this.getReservations();
          }
        }
      });
    });
  }

  getReservations(){
    this.logementService.getReservationsByLogementId(this.logement!._id).subscribe( (reservations: Array<LogementReservation>) => {
      reservations.forEach( res => {
        const dd = res.dateDebut?.split("/");
        const df = res.dateFin?.split("/");
        const dateFin = df![1] + "-" + df![0] + "-" + df![2];
        const dateDebut = dd![1] + "-" + dd![0] + "-" + dd![2];
        const nuits = this.getNbNuits(new Date(dateFin), new Date(dateDebut));
        for(let i = 0; i < nuits; i++){
          this.datesUnavailable.push(new Date(new Date(dateDebut).getTime() + i*(1000 * 60 * 60 * 24)))
        }
      })
    })
  }

  completeLogement() {
    this.logement!.galleryImages = [];
    this.logement?.images?.forEach(image => {
      this.logement?.galleryImages?.push(new galleryImage(this.serverImg + image, this.serverImg + image, this.serverImg + image))
    })
    this.logement?.equipements.forEach(equipement => {
      let eq = this.equipementsList.find(e => e.element === equipement);
      if (typeof eq === "undefined") {
        eq = this.equipementsSecuriteList.find(e => e.element === equipement);
      }
      this.equipements.push(eq);
    })
  }

  filterDates = (d: Date | null): boolean => {
    if(new Date(Date.now()).getTime() > d!.getTime()){
      return false;
    }
    const day = d!.getDate();
    const month = d!.getMonth();
    const year = d!.getFullYear();
    let available = true;
    for(let i = 0; i < this.datesUnavailable.length; i++){
      if (day === this.datesUnavailable[i].getDate() && month === this.datesUnavailable[i].getMonth()+1 && year === this.datesUnavailable[i].getFullYear()) {
        available = false;
        break;
      }
    }
    return available;
  }

  startDateChanged(e: any) {
    const date = e.value;
    if (date) {
      const day = date.getDate();
      for (let i = 0; i < this.datesUnavailable.length; i++) {
        if (day < this.datesUnavailable[i].getDate()) {
          this.maxDate = this.datesUnavailable[i];
          if (day + 1 === this.datesUnavailable[i].getDate()) {
            this.dateFin = date;
          }
          break;
        }
      }
    } else {
      this.maxDate = this.calendarMaxDate;
    }
  }
  
  endDateChanged(){
    if(this.dateDebut && this.dateFin){
      const time = this.dateFin!.getTime() - this.dateDebut!.getTime();
      const nights = Math.floor((time / 1000) / 3600) / 24;
      this.prixTotal = nights * (this.logement!.prix + (this.logement!.prix * 10/100));
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
        this.mail.to = this.logement!.annonceur;
        this.mail.subject = this.logement!.ville + " " + this.logement!.addresse;
        this.mailsService.contactHost(this.mail).subscribe(
          res => {
            this.infoService.popupInfo("mail envoyé avec succès");
          },
          err => {
            this.infoService.popupInfo("Une erreur s'est produite lors de l'envoi du mail : "+err.statusText);
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
    if(this.dateFin === null || this.dateDebut === null){
      this.infoService.popupInfo("Les dates séléctionnées sont invalides");
      return;
    }
    let logementReservation : LogementReservation = new LogementReservation();
    const nuits = this.getNbNuits(this.dateFin!, this.dateDebut!);
    logementReservation.prix = this.prixTotal = nuits * (this.logement!.prix + (this.logement!.prix * 10/100));
    logementReservation.annonceur = this.logement?.annonceur;
    const dayDebut = this.dateDebut?.getDate().toString().length === 1 ? "0"+this.dateDebut?.getDate() : this.dateDebut?.getDate();
    const dayFin = this.dateFin?.getDate().toString().length === 1 ? "0"+this.dateFin?.getDate() : this.dateFin?.getDate();
    const monthDebut = this.dateDebut?.getMonth().toString().length === 1 ? "0"+this.dateDebut?.getMonth() : this.dateDebut?.getMonth();
    const monthFin = this.dateFin?.getMonth().toString().length === 1 ? "0"+this.dateFin?.getMonth() : this.dateFin?.getMonth();
    logementReservation.dateDebut = dayDebut + "/" + monthDebut + "/" + this.dateDebut?.getFullYear();
    logementReservation.dateFin = dayFin + "/" + monthFin + "/" + this.dateFin?.getFullYear();
    logementReservation.logementId = this.logement?._id;
    const dialogRef = this.dialog.open(PopupReservationLogementComponent, {
      width: '450px',
      data: logementReservation,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        logementReservation.emailDemandeur = result.emailDemandeur;
        logementReservation.message = result.message;
        this.logementService.reserverLocation(logementReservation).subscribe( (res: string) => {
          this.infoService.popupInfo(res);
        },
        err => {
          this.infoService.popupInfo(err.statusText);
        })
      }
    });
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

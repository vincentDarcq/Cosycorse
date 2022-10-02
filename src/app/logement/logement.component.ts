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
import { DateFilterFn } from '@angular/material/datepicker';

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
  datesUnavailable = [new Date("10-04-2022"), new Date("10-08-2022"), new Date("10-18-2022")];

  constructor(
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService
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
            })
          } else {
            this.completeLogement();
          }
        }
      });
    });
  }

  filterDates = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    const month = (d || new Date()).getMonth();
    const year = (d || new Date()).getFullYear();
    let available = true;
    this.datesUnavailable.forEach(d => {
      if (day === d.getDate() && month === d.getMonth() && year === d.getFullYear()) {
        available = false;
      }
    })
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

  clearSelection() {
    this.dateDebut = this.dateFin = undefined;
    this.maxDate = this.calendarMaxDate;
  }

  schedule() {
    console.log("debut : " + this.dateDebut)
    console.log("fin : " + this.dateFin)
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

  ngOnDestroy(): void {
    if (this.subActivatedRoute) { this.subActivatedRoute.unsubscribe() }
    if (this.subLogements) { this.subLogements.unsubscribe() }
  }
}

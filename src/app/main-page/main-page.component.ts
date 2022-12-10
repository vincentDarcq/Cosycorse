import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { LogementService } from '../services/logement.service';
import { ActiviteService } from '../services/activite.service';
import { Activite } from '../models/activite';
import { Subscription } from 'rxjs';
import { Lieu } from '../models/lieu';
import { LieuService } from '../services/lieu.service';
import { Section } from '../models/sections';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [ ]
})
export class MainPageComponent implements OnInit, OnDestroy {

  activites: Array<Activite>;
  lieux: Array<Lieu>;
  subActivites: Subscription;
  subLieux: Subscription;
  sectionsActivites: Array<Section>;
  sectionsLieux: Array<Section>;

  constructor(
    private logementService: LogementService,
    private activiteService: ActiviteService,
    private lieuService: LieuService
  ) {
    this.activites = new Array();
    this.lieux = new Array();
    this.sectionsActivites = new Array();
    this.sectionsLieux = new Array();
  }
  
  ngOnInit(): void {
    this.logementService.getRecentsLogement();
    this.subActivites = this.activiteService.fetchActivites().subscribe((activites: Array<Activite>) => {
      this.activites = activites;
      this.activites.forEach(a => {
        a.indexImage = 0;
        a.animationState = "false";
      });
      for(let i = 0; i < this.activites.length; i+= 4){
        const section = new Section([this.activites[i], this.activites[i+1], this.activites[i+2], this.activites[i+3]]);
        this.sectionsActivites.push(section);
      }
    });
    this.subLieux = this.lieuService.fetchLieux().subscribe((lieux: Array<Lieu>) => {
      this.lieux = lieux;
      this.lieux.forEach(l => {
        l.indexImage = 0;
        l.animationState = "false";
      });
      for(let i = 0; i < this.lieux.length; i+= 4){
        const section = new Section([this.lieux[i], this.lieux[i+1], this.lieux[i+2], this.lieux[i+3]]);
        this.sectionsLieux.push(section);
      }
    })
  }


  ngOnDestroy(): void {
    if(this.subActivites){this.subActivites.unsubscribe();}
    if(this.subLieux){this.subLieux.unsubscribe();}
  }

}

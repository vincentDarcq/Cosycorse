import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementService } from '../services/logement.service';
import { Map, MapOptions, latLng, tileLayer, marker, Layer } from 'leaflet';
import { MapService } from '../services/map.service';
import { Router } from '@angular/router';
import { Villes } from '../models/villes';
import { Equipements } from '../models/equipements';
import { EquipementsSecurite } from '../models/equipementsSecurite';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-logements',
  templateUrl: './logements.component.html',
  styleUrls: ['./logements.component.scss']
})
export class LogementsComponent implements OnInit {

  villeSearch: string = "";
  nbVoyageurs?: number;
  nbLits?: number;
  nbSdbs?: number;
  prix_max?: number;
  equipementsFiltres: string[] = new Array<string>();
  logementsRandom: Array<Logement> = [];
  logementsFiltres: Array<Logement> = [];
  serverImg: String = "/upload?img=";
  public subscription!: Subscription;
  displayMap: boolean = false;
  map!: Map;
  mapOptions!: MapOptions;
  layers: Array<Layer> = [];
  pagination: any = false;
  villes = Villes;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;

  @ViewChildren('checkbox') private checkInput?: QueryList<MatCheckbox>;

  constructor(
    private logementService: LogementService,
    private mapService: MapService,
    private router: Router,
    private zone: NgZone,
    private infoService: InfoService
  ) {
    this.logementService.getRecentsLogement();
  }

  ngOnInit(): void {
    this.subscription = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
      this.logementsRandom = logements;
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addLogementsOnMap(logements);
      }else {
        this.initializeMap();
      }
    })
  }

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map;
    while (this.logementsRandom.length === 0) {
      await new Promise(f => setTimeout(f, 200));
    }
    this.addLogementsOnMap(this.logementsRandom);
  }
  
  addLogementsOnMap(logements: Array<Logement>){
    logements.forEach(l => {
      const prix = l.prix + l.prix*10/100;
      const coordinates = this.mapService.newPoint(l.latitude, l.longitude);
      const point = this.mapService.createPoint(coordinates)
      const layer = marker(point)
        .setIcon(this.mapService.getRedIcon())
        .on('click', () => {
          this.zone.run(() => {
            this.openLogementInNewWindow(l._id);
          })
        })
        .bindTooltip("<div style='background:white; width: 30px;'><b>" + prix.toString() + "€" + "</b></div>",
          {
            direction: 'right',
            permanent: true,
            offset: [10, 0],
            opacity: 0.75,
            className: 'leaflet-tooltip'
          });
      this.map.addLayer(layer);
      this.layers.push(layer);
    })
  }

  selectArrow(logements: Array<Logement>, indexLogement: number, index: number, event: any) {
    event.stopPropagation()
    if (index < (this.logementsRandom[indexLogement].images!.length - 1)) {
      logements[indexLogement].indexImage++;
    }
  }

  selectLeftArrow(logements: Array<Logement>, indexLogement: number, index: number, event: any) {
    event.stopPropagation()
    if (index > 0) {
      logements[indexLogement].indexImage--;
    }
  }

  openLogementInNewWindow(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/logement", id])
    );
    window.open(url);
  }

  actualiser(){
    this.logementService.getLogementByFiltres(
      this.villeSearch, 
      this.nbVoyageurs!, 
      this.nbLits!, 
      this.nbSdbs!, 
      this.prix_max!,
      this.equipementsFiltres
    ).subscribe( (logements: Array<Logement>) => {
        if(logements.length > 0){
          this.logementsFiltres = logements;
          this.logementsFiltres.forEach(l => l.indexImage = 0);
          this.layers.forEach(l => this.map.removeLayer(l));
          this.addLogementsOnMap(this.logementsFiltres);
        }else {
          this.infoService.popupInfo("Il n'y a pas de logements correspondant à vos critères vos critères");
        }
      })
  }

  effacerFiltres(){
    this.villeSearch = "";
    this.nbLits = this.nbVoyageurs = this.nbSdbs = this.prix_max = undefined;
    this.logementsFiltres = this.equipementsFiltres = [];
    this.checkInput!.forEach((element) => {
      element.checked = false;
    });
    this.layers.forEach(l => this.map.removeLayer(l));
    this.addLogementsOnMap(this.logementsRandom)
  }

  valueChange(equipement: string, event: MatCheckboxChange){
    if(event.checked){
      this.equipementsFiltres.push(equipement);
    }else {
      const index = this.equipementsFiltres.findIndex(e => e === equipement);
      this.equipementsFiltres.splice(index, 1);
    }
  }

}

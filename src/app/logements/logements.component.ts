import { Component, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementService } from '../services/logement.service';
import { Map, MapOptions, marker, Layer, LatLngBounds } from 'leaflet';
import { MapService } from '../services/map.service';
import { Router } from '@angular/router';
import { Villes } from '../models/villes';
import { Equipements } from '../models/equipements';
import { EquipementsSecurite } from '../models/equipementsSecurite';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { InfoService } from '../services/info.service';
import { mapSquare } from '../models/mapSquare';
import { SlideInOutAnimation } from '../animations/animations';

@Component({
  selector: 'app-logements',
  templateUrl: './logements.component.html',
  styleUrls: ['./logements.component.scss'],
  animations: [SlideInOutAnimation]
})
export class LogementsComponent implements OnInit, OnDestroy {

  villeSearch: string = "";
  nbVoyageurs: number;
  nbLits: number;
  nbSdbs: number;
  prix_max: number;
  equipementsFiltres: string[] = new Array<string>();
  logementsRandom: Array<Logement> = [];
  logementsFiltres: Array<Logement> = [];
  serverImg: String = "/upload?img=";
  public subLogements: Subscription;
  public subBounds: Subscription;
  public bounds: mapSquare;
  displayMap: boolean = false;
  map: Map;
  mapOptions: MapOptions;
  layers: Array<Layer> = [];
  pagination: any = false;
  villes = Villes;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;
  animationState = 'false';
  dateDebut: Date;
  dateFin: Date;

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
    this.subLogements = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
      this.logementsRandom = logements;
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addLogementsOnMap(logements);
      }else {
        this.initializeMap();
      }
    });
    this.subBounds = this.logementService.bounds.subscribe( (bounds: LatLngBounds) => {
      this.bounds = new mapSquare(
        bounds.getSouthWest().lat, bounds.getNorthWest().lat,
        bounds.getSouthWest().lng, bounds.getSouthEast().lng);
      if(this.bounds.latMin !== 41.1455697310095 && this.bounds.latMax !== 43.26120612479979){
        this.actualiser();
      }
    })
  }

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map.on('moveend', () => {
      this.logementService.setBounds(map.getBounds());
    });
    this.logementService.setBounds(map.getBounds());
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
    const dd = this.formatDate(this.dateDebut);
    const df = this.formatDate(this.dateFin);
    this.logementService.getLogementByFiltres(
      this.villeSearch, 
      this.nbVoyageurs, 
      this.nbLits, 
      this.nbSdbs, 
      this.prix_max,
      this.equipementsFiltres,
      this.bounds,
      dd,
      df
    ).subscribe( (logements: Array<Logement>) => {
        if(logements.length > 0){
          this.logementsFiltres = logements;
          this.logementsFiltres.forEach(l => l.indexImage = 0);
          this.layers.forEach(l => this.map.removeLayer(l));
          this.addLogementsOnMap(this.logementsFiltres);
        }
      })
  }

  formatDate(date: Date): string{
    let fd = "";
    if(date){
      const month = (date.getMonth()+1).toString();
      const day = date.getDate()/10 >= 1 ? date.getDate().toString() : "0" + date.getDate().toString();
      const year = date.getFullYear().toString();
      fd = month+"/"+day+"/"+year;
    }
    return fd;
  }

  effacerFiltres(){
    this.villeSearch = "";
    this.nbLits = this.nbVoyageurs = this.nbSdbs = this.prix_max = this.dateDebut = this.dateFin = undefined;
    this.logementsFiltres = this.equipementsFiltres = [];
    this.checkInput!.forEach((element) => {
      element.checked = false;
    });
    this.layers.forEach(l => this.map.removeLayer(l));
    this.addLogementsOnMap(this.logementsRandom);
    console.log(this.logementsRandom.length)
  }

  filterDates = (d: Date): boolean => {
    if(new Date(Date.now()).getTime() > d.getTime()){
      return false;
    }
    return true;
  }

  valueChange(equipement: string, event: MatCheckboxChange){
    if(event.checked){
      this.equipementsFiltres.push(equipement);
    }else {
      const index = this.equipementsFiltres.findIndex(e => e === equipement);
      this.equipementsFiltres.splice(index, 1);
    }
  }

  expandFilters(){
    this.animationState = this.animationState === 'false' ? 'true' : 'false';
  }

  ngOnDestroy(): void {
    if(this.subLogements){this.subLogements.unsubscribe();}
  }

}

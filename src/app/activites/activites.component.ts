import { Component, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';
import { LatLngBounds, Layer, Map, MapOptions, marker } from 'leaflet';
import { Subscription } from 'rxjs';
import { SlideInOutAnimation } from '../animations/activiteDescriptionInOut';
import { Activite } from '../models/activite';
import { mapSquare } from '../models/mapSquare';
import { ActivitesType } from '../models/type-activite';
import { User } from '../models/user.model';
import { Villes } from '../models/villes';
import { ActiviteService } from '../services/activite.service';
import { MapService } from '../services/map.service';
import { TranslatorService } from '../services/translator.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-activites',
  templateUrl: './activites.component.html',
  styleUrls: ['./activites.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ActivitesComponent implements OnInit, OnDestroy {

  displayMap: boolean = false;
  filtre: boolean = false;
  mapOptions: MapOptions;
  map: Map;
  activites: Array<Activite>;
  activitesFiltered: Array<Activite>;
  layers: Array<Layer> = [];
  serverImg: String = "/upload?img=";
  titreSearch: string;
  villeSearch: string;
  villes = Villes;
  typeSearch: string;
  activite_types = ActivitesType;
  public subscription: Subscription;
  public user: User;
  public subBounds: Subscription;
  public bounds: mapSquare;

  @ViewChildren('radioButton') private radioButtons?: QueryList<MatRadioButton>;

  constructor(
    private activiteService: ActiviteService,
    private mapService: MapService,
    private zone: NgZone,
    private router: Router,
    private userService: UserService,
    private translator: TranslatorService
  ) { 
    this.activites = new Array();
    this.activitesFiltered = new Array();
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    });
    this.activiteService.fetchActivites().subscribe((activites: Array<Activite>) => {
      this.activites = activites;
      this.activites.forEach(a => {
        a.indexImage = 0;
        a.animationState = "false";
      });
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addActivitesOnMap(activites);
      }else {
        this.initializeMap();
      }
    });
    this.subBounds = this.activiteService.bounds.subscribe( (bounds: LatLngBounds) => {
      this.bounds = new mapSquare(
        bounds.getSouthWest().lat, bounds.getNorthWest().lat,
        bounds.getSouthWest().lng, bounds.getSouthEast().lng);
      if(this.bounds.latMin !== 41.1455697310095 && this.bounds.latMax !== 43.26120612479979){
        this.actualiser();
      }
    });
  }

  expandDescription(animationState: string, index: number){
    for(let i = 0; i < this.activites.length; i++){
      if(i !== index){
        this.activites[i].animationState = 'false';
      }
    }
    this.activites[index].animationState = animationState === 'false' ? 'true' : 'false';
  }

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map.on('moveend', () => {
      this.activiteService.setBounds(map.getBounds());
    });
    this.activiteService.setBounds(map.getBounds());
    while (this.activites.length === 0) {
      await new Promise(f => setTimeout(f, 200));
    }
    this.addActivitesOnMap(this.activites);
  }
  
  addActivitesOnMap(activites: Array<Activite>){
    activites.forEach(a => {
      const coordinates = this.mapService.newPoint(a.latitude, a.longitude);
      const point = this.mapService.createPoint(coordinates)
      const layer = marker(point)
        .setIcon(this.mapService.getRedIcon())
        .on('click', () => {
          this.zone.run(() => {
            if(this.user.email === "vincent.darcq@hotmail.fr"){
              this.router.navigate(['/edit-activite', a._id]);
            }
          })
        })
      this.map.addLayer(layer);
      this.layers.push(layer);
    })
  }

  selectArrow(indexActivite: number, index: number, event: any) {
    event.stopPropagation()
    if (index < (this.activites[indexActivite].images!.length - 1)) {
      this.activites[indexActivite].indexImage++;
    }
  }

  selectLeftArrow(indexActivite: number, index: number, event: any) {
    event.stopPropagation()
    if (index > 0) {
      this.activites[indexActivite].indexImage--;
    }
  }

  actualiser(){
    this.activiteService.findByFilters(
      this.titreSearch, 
      this.villeSearch, 
      this.typeSearch,
      this.bounds
    ).subscribe((activites: Array<Activite>) => {
      this.activitesFiltered = activites;
      this.activitesFiltered.forEach(a => a.indexImage = 0);
      this.layers.forEach(l => this.map.removeLayer(l));
      this.addActivitesOnMap(this.activitesFiltered);
      this.filtre = true;
    })
  }

  effacerFiltres(){
    this.villeSearch = this.titreSearch = "";
    this.activitesFiltered = [];
    this.radioButtons.forEach((element) => {
      element.checked = false;
    });
    this.layers.forEach(l => this.map.removeLayer(l));
    this.addActivitesOnMap(this.activites);
    this.filtre = false;
  }

  translate(s: string): string {
    return this.translator.get(s);
  }

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
  }

}

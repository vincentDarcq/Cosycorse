import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GeoResponse } from '../models/geo-response.model';
import { LogementsType } from '../models/logement-type';
import { Equipements } from '../models/equipements';
import { EquipementsSecurite } from '../models/equipementsSecurite';
import { GeoService } from '../services/geo.service';
import { Map, marker, MapOptions, tileLayer, latLng } from 'leaflet';
import { MapPoint } from '../models/map-point.model';
import { MapService } from '../services/map.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Logement } from '../models/logement';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { LogementService } from '../services/logement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-annonce-form',
  templateUrl: './annonce-form.component.html',
  styleUrls: ['./annonce-form.component.scss']
})
export class AnnonceFormComponent implements OnInit, OnDestroy {

  public subscription!: Subscription;
  public user!: User;
  formData = new FormData();
  logementsType = LogementsType;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;
  logement: string = "";
  addresse: string = "";
  description: string = "";
  nbVoyageur!: number;
  nbLits!: number;
  nbSdb!: number;
  prix!: number;
  equipements: string[] = new Array<string>();
  latAdresse!: number;
  longAdresse!: number;
  files: File[] = [];
  searchResults!: GeoResponse[];
  map!: Map;
  mapPoint!: MapPoint;
  mapOptions!: MapOptions;
  lastLayer: any;
  displayMap: boolean = false;
  mauvaiseAdresse: boolean = false;
  noAdresse: boolean = false;
  noSearch: boolean = false;
  noLogement: boolean = false;
  noLits: boolean = false;
  noSdb: boolean = false;
  noVoyageur: boolean = false;
  noPrix: boolean = false;

  constructor(
    private geoService: GeoService,
    private mapService: MapService,
    private zone: NgZone,
    private userService: UserService,
    private logementService: LogementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe( (user: User | null) => {
      this.user = new User(user?._id, user?.email, user?.name);
    })
  }

  addresseFromGeoApi() {
    this.geoService.getLocationFromGeoapify(this.addresse).subscribe((results: any) => {
      this.searchResults = new Array<GeoResponse>();
      for (let feature of results.features) {
        const result = new GeoResponse(
          feature.properties.lat, feature.properties.lon, feature.properties.formatted)
        this.searchResults.push(result);
      }
    });
  }

  // enter(event: KeyboardEvent){
  //   if (event.code === "Enter" || event.code === "NumpadEnter") {
  //     this.addresseFromGeoApi();
  //   }
  // }

  public onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e) => {
      this.zone.run(() => {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
      })
    })
    this.newPoint(this.latAdresse, this.longAdresse);
    const point = this.mapService.createPoint(this.mapPoint)
    this.lastLayer = marker(point).setIcon(this.mapService.getRedIcon()).addTo(this.map);
  }

  selectAdresse(geoResponse: GeoResponse){
    this.noSearch = false;
    if((geoResponse.longitude! < 7.975044250488282 || geoResponse.longitude! > 9.644966125488283)
      && (geoResponse.latitude! < 41.35774173825274 || geoResponse.latitude! > 43.06637963617605)){
        this.mauvaiseAdresse = true;
        return;
    }
    this.mauvaiseAdresse = false;
    this.latAdresse = geoResponse.latitude!;
    this.longAdresse = geoResponse.longitude!;
    if (!this.mapOptions) {
      this.initializeMap();
    } else {
      this.updateMap();
    }
  }

  private initializeMap() {
    this.mapOptions = {
      center: latLng(this.latAdresse, this.longAdresse),
      zoom: 15,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
    this.displayMap = true;
  }

  private updateMap() {
    if (this.map && this.map.hasLayer(this.lastLayer)) {
      this.map.removeLayer(this.lastLayer);
      this.newPoint(this.latAdresse, this.longAdresse);
      this.createMarker();
    }
  }

  private newPoint(latitude: number, longitude: number, address?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      address: ""
    };
  }

  private createMarker() {
    const point = this.mapService.createPoint(this.mapPoint)
    this.lastLayer = marker(point).setIcon(this.mapService.getRedIcon())
      .addTo(this.map)
    this.map.flyTo(point, this.map.getZoom());
  }

  valueChange(equipement: string, event: MatCheckboxChange){
    if(event.checked){
      this.equipements.push(equipement);
    }else {
      const index = this.equipements.findIndex(e => e === equipement);
      this.equipements.splice(index, 1);
    }
  }

  onDropZone(event: any){
    this.files.push(...event.addedFiles);
    this.fillFormData();
  }
  
  onRemove(event: any){
    this.files.splice(this.files.indexOf(event), 1);
    this.fillFormData();
  }
  
  fillFormData(){    
    for (let i = 0; i < this.files.length; i++) { 
      this.formData.append("image"+(i+1), this.files[i], this.files[i].name);
    }
  }

  submit(){
    this.validation();
    const createLogement = new Logement(this.addresse, this.description, this.logement, this.nbVoyageur,
      this.nbLits, this.nbSdb, this.latAdresse, this.longAdresse, this.user.name, this.prix, this.equipements);
    this.logementService.createLogement(createLogement).subscribe( (log: Logement) => {
      this.logementService.uploadPhotos(this.formData, log._id ).subscribe( (l: Logement) => {
        console.log(l)
        this.router.navigate(['/']);
      })
    })
  }
  
  validation(){
    if(typeof this.latAdresse === "undefined"){
      this.noSearch = true;
    }
    if(this.addresse.length == 0){
      this.noAdresse = true;
    }else {
      this.noAdresse = false;
    }
    if(this.logement.length == 0){
      this.noLogement = true;
    }else {
      this.noLogement = false;
    }
    if(typeof this.nbLits === "undefined" || this.nbLits <= 0){
      this.noLits = true;
    }else {
      this.noLits = false;
    }
    if(typeof this.nbSdb === "undefined" || this.nbSdb <= 0){
      this.noSdb = true;
    }else {
      this.noSdb = false;
    }
    if(typeof this.nbVoyageur === "undefined" || this.nbVoyageur <= 0){
      this.noVoyageur = true;
    }else {
      this.noVoyageur = false;
    }
    if(typeof this.prix === "undefined" || this.prix <= 0){
      this.noPrix = true;
    }else {
      this.noPrix = false;
    }
    if(this.noAdresse || this.noLogement || this.noLits || this.noSdb || this.noVoyageur){
      return;
    }
  }

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
  }

}

import { Component, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { LatLngBounds, Layer, Map, MapOptions, marker } from 'leaflet';
import { Lieu } from '../models/lieu';
import { Villes } from '../models/villes';
import { LieuService } from '../services/lieu.service';
import { MapService } from '../services/map.service';
import { LieuxType } from '../models/type-lieu';
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { mapSquare } from '../models/mapSquare';
import { LieuInOutAnimation } from '../animations/lieuDescriptionInOut';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-lieux',
  templateUrl: './lieux.component.html',
  styleUrls: ['./lieux.component.scss'],
  animations: [LieuInOutAnimation]
})
export class LieuxComponent implements OnInit, OnDestroy {

  villes = Villes;
  displayMap: boolean = false;
  mapOptions!: MapOptions;
  map!: Map;
  lieux!: Array<Lieu>;
  lieuxFiltered!: Array<Lieu>;
  serverImg: String = "/upload?img=";
  layers: Array<Layer> = [];
  lieu_types = LieuxType;
  nomSearch!: string;
  typeSearch!: string;
  villeSearch!: string;
  public subscription!: Subscription;
  public user!: User;
  public subBounds: Subscription;
  public bounds: mapSquare;

  @ViewChildren('radioButton') private radioButtons?: QueryList<MatRadioButton>;

  constructor(
    private lieuService: LieuService,
    private mapService: MapService,
    private zone: NgZone,
    private router: Router,
    private userService: UserService,
    private translator: TranslatorService
  ) {
    this.lieux = new Array();
    this.lieuxFiltered = new Array();
  }

  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    });
    this.lieuService.fetchLieux().subscribe((lieux: Array<Lieu>) => {
      this.lieux = lieux;
      this.lieux.forEach(l => {
        l.indexImage = 0;
        l.animationState = "false";
      }
      );
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addLieuxOnMap(lieux);
      }else {
        this.initializeMap();
      }
    });
    this.subBounds = this.lieuService.bounds.subscribe( (bounds: LatLngBounds) => {
      this.bounds = new mapSquare(
        bounds.getSouthWest().lat, bounds.getNorthWest().lat,
        bounds.getSouthWest().lng, bounds.getSouthEast().lng);
      if(this.bounds.latMin !== 41.1455697310095 && this.bounds.latMax !== 43.26120612479979){
        this.actualiser();
      }
    });
  }

  selectArrow(lieux: Array<Lieu>, indexLieu: number, index: number, event: any) {
    event.stopPropagation()
    if (index < (this.lieux[indexLieu].images!.length - 1)) {
      lieux[indexLieu].indexImage++;
    }
  }

  selectLeftArrow(lieux: Array<Lieu>, indexLieu: number, index: number, event: any) {
    event.stopPropagation()
    if (index > 0) {
      lieux[indexLieu].indexImage--;
    }
  }

  expandDescription(animationState: string, index: number){
    for(let i = 0; i < this.lieux.length; i++){
      if(i !== index){
        this.lieux[i].animationState = 'false';
      }
    }
    this.lieux[index].animationState = animationState === 'false' ? 'true' : 'false';
  }

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map.on('moveend', () => {
      this.lieuService.setBounds(map.getBounds());
    });
    this.lieuService.setBounds(map.getBounds());
    while (this.lieux.length === 0) {
      await new Promise(f => setTimeout(f, 200));
    }
    this.addLieuxOnMap(this.lieux);
  }
  
  addLieuxOnMap(lieux: Array<Lieu>){
    lieux.forEach(l => {
      const coordinates = this.mapService.newPoint(l.latitude, l.longitude);
      const point = this.mapService.createPoint(coordinates)
      const layer = marker(point)
        .setIcon(this.mapService.getRedIcon())
        .on('click', () => {
          this.zone.run(() => {
            if(this.user.email === "vincent.darcq@hotmail.fr"){
              this.router.navigate(['/edit-lieu', l._id]);
            }
          })
        })
        .bindTooltip("<div style='background:white; width: fit-content;'><b>" + l.nom + "</b></div>",
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

  actualiser(){
    this.lieuService.findByFilters(
      this.nomSearch, 
      this.villeSearch, 
      this.typeSearch,
      this.bounds
    ).subscribe((lieux: Array<Lieu>) => {
      this.lieuxFiltered = lieux;
      this.lieuxFiltered.forEach(l => {
        l.indexImage = 0;
        l.animationState = "false";
      });
      this.layers.forEach(l => this.map.removeLayer(l));
      this.addLieuxOnMap(this.lieuxFiltered);
    })
  }

  effacerFiltres(){
    this.villeSearch = this.nomSearch = "";
    this.lieuxFiltered = [];
    this.radioButtons.forEach((element) => {
      element.checked = false;
    });
    this.layers.forEach(l => this.map.removeLayer(l));
    this.addLieuxOnMap(this.lieux);
  }

  translate(s: string): string {
    return this.translator.get(s);
  }

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
    if(this.subBounds){this.subBounds.unsubscribe();}
  }

}

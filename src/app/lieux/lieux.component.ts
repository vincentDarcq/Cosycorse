import { Component, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Layer, Map, MapOptions, marker } from 'leaflet';
import { Lieu } from '../models/lieu';
import { Villes } from '../models/villes';
import { LieuService } from '../services/lieu.service';
import { MapService } from '../services/map.service';
import { LieuxType } from '../models/type-lieu';
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-lieux',
  templateUrl: './lieux.component.html',
  styleUrls: ['./lieux.component.scss']
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
  public user!: User

  @ViewChildren('radioButton') private radioButtons?: QueryList<MatRadioButton>;

  constructor(
    private lieuService: LieuService,
    private mapService: MapService,
    private zone: NgZone,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService
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
      this.lieux.forEach(l => l.indexImage = 0);
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addLieuxOnMap(lieux);
      }else {
        this.initializeMap();
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

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map;
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
    this.lieuService.findByFilters(this.nomSearch, this.villeSearch, this.typeSearch).subscribe((lieux: Array<Lieu>) => {
      this.lieuxFiltered = lieux;
      this.lieuxFiltered.forEach(l => l.indexImage = 0);
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

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
  }

}

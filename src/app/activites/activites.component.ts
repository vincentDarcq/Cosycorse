import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';
import { Layer, Map, MapOptions, marker } from 'leaflet';
import { Activite } from '../models/activite';
import { ActivitesType } from '../models/type-activite';
import { Villes } from '../models/villes';
import { ActiviteService } from '../services/activite.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-activites',
  templateUrl: './activites.component.html',
  styleUrls: ['./activites.component.scss']
})
export class ActivitesComponent implements OnInit {

  displayMap: boolean = false;
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

  @ViewChildren('radioButton') private radioButtons?: QueryList<MatRadioButton>;

  constructor(
    private activiteService: ActiviteService,
    private mapService: MapService,
    private zone: NgZone
  ) { 
    this.activites = new Array();
    this.activitesFiltered = new Array();
  }

  ngOnInit(): void {
    this.activiteService.fetchActivites().subscribe((activites: Array<Activite>) => {
      this.activites = activites;
      this.activites.forEach(a => a.indexImage = 0);
      if(this.map){
        this.layers.forEach(l => this.map.removeLayer(l));
        this.addActivitesOnMap(activites);
      }else {
        this.initializeMap();
      }
    });
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
    this.activiteService.findByFilters(this.titreSearch, this.villeSearch, this.typeSearch).subscribe((activites: Array<Activite>) => {
      this.activitesFiltered = activites;
      this.activitesFiltered.forEach(a => a.indexImage = 0);
      this.layers.forEach(l => this.map.removeLayer(l));
      this.addActivitesOnMap(this.activitesFiltered);
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
  }

}

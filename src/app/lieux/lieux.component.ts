import { Component, OnInit } from '@angular/core';
import { Layer, Map, MapOptions, marker } from 'leaflet';
import { Lieu } from '../models/lieu';
import { Villes } from '../models/villes';
import { LieuService } from '../services/lieu.service';
import { MapService } from '../services/map.service';
import { LieusType } from '../models/type-lieu';

@Component({
  selector: 'app-lieux',
  templateUrl: './lieux.component.html',
  styleUrls: ['./lieux.component.scss']
})
export class LieuxComponent implements OnInit {

  villes = Villes;
  displayMap: boolean = false;
  mapOptions!: MapOptions;
  map!: Map;
  lieux!: Array<Lieu>;
  serverImg: String = "/upload?img=";
  layers: Array<Layer> = [];
  lieu_types = LieusType;
  typeSearch: string = "";
  villeSearch: string = "";

  constructor(
    private lieuService: LieuService,
    private mapService: MapService
  ) {
    this.lieux = new Array();
  }

  ngOnInit(): void {
    this.lieuService.fetchLieux().subscribe((lieux: Array<Lieu>) => {
      this.lieux = lieux;
      this.lieux.forEach(l => l.indexImage = 0);
      this.initializeMap();
    })
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
        .addTo(this.map)
        .bindTooltip("<div style='background:white; width: fit-content;'><b>" + l.nom + "</b></div>",
          {
            direction: 'right',
            permanent: true,
            offset: [10, 0],
            opacity: 0.75,
            className: 'leaflet-tooltip'
          });
      this.layers.push(layer);
    })
  }

  actualiser(){

  }

  effacerFiltres(){
    
  }

}

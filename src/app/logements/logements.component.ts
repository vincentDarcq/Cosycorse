import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementService } from '../services/logement.service';
import { Map, MapOptions, latLng, tileLayer, marker, Layer } from 'leaflet';
import { MapService } from '../services/map.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logements',
  templateUrl: './logements.component.html',
  styleUrls: ['./logements.component.scss']
})
export class LogementsComponent implements OnInit {

  villeSearch: string = "";
  nbVoyageurs?: number;
  nbLits?: number;
  logementsRandom: Array<Logement> = [];
  serverImg: String = "/upload?img=";
  public subscription!: Subscription;
  displayMap: boolean = false;
  map!: Map;
  mapOptions!: MapOptions;
  layers: Array<Layer> = [];
  pagination: any = false;

  constructor(
    private logementService: LogementService,
    private mapService: MapService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.subscription = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
      this.logementsRandom = logements;
      this.initializeMap();
    })
  }

  private initializeMap() {
    this.mapOptions = {
      center: latLng(42.21174173825274, 9.05044250488282),
      zoom: 8,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 50,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
    this.displayMap = true;
  }

  public async onMapReady(map: Map) {
    this.map = map;
    while (this.logementsRandom.length === 0) {
      await new Promise(f => setTimeout(f, 200));
    }
    this.logementsRandom.forEach(l => {
      const coordinates = this.mapService.newPoint(l.latitude, l.longitude);
      const point = this.mapService.createPoint(coordinates)
      const layer = marker(point)
        .setIcon(this.mapService.getRedIcon())
        .addTo(this.map)
        .bindTooltip("<div style='background:white; width: 30px;'><b>" + l.prix.toString() + "€" + "</b></div>",
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

  selectArrow(indexLogement: number, index: number, event: any) {
    event.stopPropagation()
    if (index < (this.logementsRandom[indexLogement].images!.length - 1)) {
      this.logementsRandom[indexLogement].indexImage++;
    }
  }

  selectLeftArrow(indexLogement: number, index: number, event: any) {
    event.stopPropagation()
    if (index > 0) {
      this.logementsRandom[indexLogement].indexImage--;
    }
  }

  openLogementInNewWindow(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/logement", id])
    );
    window.open(url);
  }

}

import { Component, OnInit } from '@angular/core';
import { Map, MapOptions } from 'leaflet';
import { Villes } from '../models/villes';

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

  constructor() { }

  ngOnInit(): void {
  }

  public async onMapReady(map: Map) {
    this.map = map;
  }

}

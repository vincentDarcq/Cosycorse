import { Injectable } from '@angular/core';
import { Marker, marker, icon, latLng, LatLng, Map } from 'leaflet';
import { MapPoint } from '../models/map-point.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  public getRedIcon() {
    return icon({
      iconSize: [50, 50],
      iconAnchor: [13, 41],
      iconUrl: 'assets/icon-red.png',
    });
  }

  public createPoint(mapPoint: MapPoint): LatLng {
    const coordinates = latLng([
      mapPoint.latitude,
      mapPoint.longitude,
    ]);
    return coordinates;
  }
}

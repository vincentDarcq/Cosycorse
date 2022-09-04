import { Injectable } from '@angular/core';
import { Marker, marker, icon, latLng, LatLng, Map, tileLayer } from 'leaflet';
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

  public getMapOptions(zoom: number, maxZoom: number, lat: number, long: number){
    return {
      center: latLng(lat, long),
      zoom: zoom,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: maxZoom,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }

  public createPoint(mapPoint: MapPoint): LatLng {
    const coordinates = latLng([
      mapPoint.latitude,
      mapPoint.longitude,
    ]);
    return coordinates;
  }

  public newPoint(latitude: number, longitude: number, address?: string): MapPoint {
    return {
      latitude: latitude,
      longitude: longitude,
      address: ""
    };
  }
}

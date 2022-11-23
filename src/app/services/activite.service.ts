import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { Activite } from '../models/activite';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {

  public bounds = new Subject<LatLngBounds>();

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) { }

  public fetchActivites(): Observable<Array<Activite>>{
    return this.http.get<Array<Activite>>(`/api/activite/getAll`);
  }

  public createActivite(activite: Activite): Observable<Activite>{
    return this.http.post<Activite>(`/api/activite/create`, activite);
  }

  public uploadPhotos(photos: FormData, activiteId: string){
    return this.http.post<Activite>(`/api/activite/uploadImages`, photos, {
      params: {
        activiteId: activiteId
      }
    });
  }

  public findByFilters(titre: string, ville: string, type: string): Observable<Array<Activite>>{
    return this.http.get<Array<Activite>>(`/api/activite/getByFilters`, {
      params: {
        titre: titre,
        ville: ville,
        type: type
      }
    });
  }

  public setBounds(bounds: LatLngBounds) {
    this.zone.run(() => {
      this.bounds.next(bounds);
    });
  }
}

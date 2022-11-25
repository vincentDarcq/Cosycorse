import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Activite } from '../models/activite';
import { mapSquare } from '../models/mapSquare';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {

  public bounds = new Subject<LatLngBounds>();
  public activites: Array<Activite>;

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) { }

  public fetchActivites(): Observable<Array<Activite>>{
    return this.http.get<Array<Activite>>(`/api/activite/getAll`).pipe(
      tap((activites: Array<Activite>) => {
        this.activites = activites
      })
    );
  }

  public deletePhoto(activiteId: string, imageIndex: string){
    return this.http.get<Activite>(`/api/activite/deleteImage`, {
      params: {
        activiteId: activiteId,
        indexImage: imageIndex
      }
    });
  }

  public updateActivite(activite: Activite): Observable<Activite>{
    return this.http.post<Activite>(`/api/activite/update`, activite, {
      params: {
        activiteId: activite._id
      }
    });
  }

  public fetchActivite(activiteId: string): Observable<Activite>{
    return this.http.get<Activite>(`/api/activite/getById`, {
      params: {
        activiteId: activiteId
      }
    });
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

  public findByFilters(titre: string, ville: string, type: string, bounds: mapSquare): Observable<Array<Activite>>{
    return this.http.get<Array<Activite>>(`/api/activite/getByFilters`, {
      params: {
        titre: titre,
        ville: ville,
        type: type,
        latMax: bounds.latMax,
        latMin: bounds.latMin,
        longMax: bounds.longMax,
        longMin: bounds.longMin
      }
    });
  }

  public setBounds(bounds: LatLngBounds) {
    this.zone.run(() => {
      this.bounds.next(bounds);
    });
  }
}

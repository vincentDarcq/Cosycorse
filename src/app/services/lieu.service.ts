import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Lieu } from '../models/lieu';
import { mapSquare } from '../models/mapSquare';

@Injectable({
  providedIn: 'root'
})
export class LieuService {

  public bounds = new Subject<LatLngBounds>();
  public lieux: Array<Lieu>;

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) { }

  public setBounds(bounds: LatLngBounds) {
    this.zone.run(() => {
      this.bounds.next(bounds);
    });
  }
  
  public createLieu(lieu: Lieu): Observable<Lieu> {
    return this.http.post<Lieu>(`/api/lieu/create`, lieu);
  }

  public uploadPhotos(photos: FormData, lieuId: string): Observable<Lieu>{
    return this.http.post<Lieu>(`/api/lieu/uploadImages`, photos, {
      params: {
        lieuId: lieuId
      }
    });
  }

  public deletePhoto(lieuId: string, imageIndex: string){
    return this.http.get<Lieu>(`/api/lieux/deleteImage`, {
      params: {
        lieuId: lieuId,
        indexImage: imageIndex
      }
    });
  }

  public updateLieu(lieu: Lieu): Observable<Lieu>{
    return this.http.post<Lieu>(`/api/lieu/update`, lieu, {
      params: {
        lieuId: lieu._id
      }
    });
  }

  public fetchLieu(lieuId: string): Observable<Lieu>{
    return this.http.get<Lieu>(`/api/lieu/getById`, {
      params: {
        lieuId: lieuId
      }
    })
  }

  public fetchLieux(): Observable<Array<Lieu>>{
    return this.http.get<Array<Lieu>>(`/api/lieu/getAll`).pipe(
      tap((lieux: Array<Lieu>) => {
        this.lieux = lieux
      })
    );
  }

  public findByFilters(nom: string, ville: string, type: string, bounds: mapSquare): Observable<Array<Lieu>>{
    return this.http.get<Array<Lieu>>(`/api/lieu/getByFilters`, {
      params: {
        nom: nom,
        ville: ville,
        type: type,
        latMax: bounds.latMax,
        latMin: bounds.latMin,
        longMax: bounds.longMax,
        longMin: bounds.longMin
      }
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lieu } from '../models/lieu';

@Injectable({
  providedIn: 'root'
})
export class LieuService {

  constructor(
    private http: HttpClient
  ) { }

  public createLieu(lieu: Lieu): Observable<Lieu> {
    return this.http.post<Lieu>(`/api/lieu/create`, lieu);
  }

  public uploadPhotos(photos: FormData, lieuId: string) {
    return this.http.post<Lieu>(`/api/lieu/uploadImages`, photos, {
      params: {
        lieuId: lieuId
      }
    });
  }

  public updateLieu(lieu: Lieu) {
    return this.http.post<Lieu>(`/api/lieu/update`, lieu, {
      params: {
        lieuId: lieu._id
      }
    });
  }

  public fetchLieux(){
    return this.http.get<Array<Lieu>>(`/api/lieu/getAll`);
  }

  public findByFilters(nom: string, ville: string, type: string){
    return this.http.get<Array<Lieu>>(`/api/lieu/getByFilters`, {
      params: {
        nom: nom,
        ville: ville,
        type: type
      }
    });
  }
}

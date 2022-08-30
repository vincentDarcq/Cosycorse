import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Logement } from '../models/logement';

@Injectable({
  providedIn: 'root'
})
export class LogementService {

  constructor(private http: HttpClient) { }

  public createLogement(logement: Logement): Observable<Logement>{
    return this.http.post<Logement>(`/api/logements/create`, logement);
  }

  public deleteLogement(logementId: string){
    return this.http.get<Logement>(`/api/logements/delete`, {
      params: {
        logementId: logementId
      }
    });
  }

  public updateLogement(logement: Logement){
    return this.http.post<Logement>(`/api/logements/update`, logement, {
      params: {
        logementId: logement._id
      }
    });
  }

  public deleteImage(logementId: string, imageIndex: string){
    return this.http.get<Logement>(`/api/logements/deleteImage`, {
      params: {
        logementId: logementId,
        indexImage: imageIndex
      }
    });
  }

  public uploadPhotos(photos: FormData, logementId: string){
    return this.http.post<Logement>(`/api/logements/uploadImages`, photos, {
      params: {
        logementId: logementId
      }
    });
  }

  public getLogementsByAnnonceur(annonceur: string){
    return this.http.get<Array<Logement>>(`/api/logements/getByAnnonceur`, {
      params: {
        annonceur: annonceur
      }
    });
  }
}

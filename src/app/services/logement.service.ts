import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logement } from '../models/logement';

@Injectable({
  providedIn: 'root'
})
export class LogementService {

  public logementsRandom!: BehaviorSubject<Array<Logement>>;

  constructor(private http: HttpClient) {
    this.logementsRandom = new BehaviorSubject(Array<Logement>());
    this.getRecentsLogement();
  }

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

  public getRecentsLogement(){
    return this.http.get<Array<Logement>>(`/api/logements/getRandom`).subscribe( (logements: Array<Logement>) => {
      logements.forEach(l => {
        l.indexImage = 0;
      })
      this.logementsRandom?.next(logements);
    });
  }
}

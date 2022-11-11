import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementReservation } from '../models/logementReservation';
import { MonCompteReservation } from '../models/monCompteReservation';
import { MonCompteVoyage } from '../models/monCompteVoyage';
import { Villes } from '../models/villes';

@Injectable({
  providedIn: 'root'
})
export class LogementService {

  villes = Villes;

  public logementsRandom!: BehaviorSubject<Array<Logement>>;

  constructor(private http: HttpClient) {
    this.logementsRandom = new BehaviorSubject(Array<Logement>());
  }
  
  public getRecentsLogement(){
    if(this.logementsRandom.value.length === 0){
      this.villes.forEach(ville => {
        this.getRecentsLogementForVille(ville);
      });
    }
  }

  public createLogement(logement: Logement): Observable<Logement> {
    return this.http.post<Logement>(`/api/logements/create`, logement);
  }

  public getLogementById(logementId: string): Logement | undefined {
    return this.logementsRandom.value.find(l => l._id === logementId);
  }

  public fetchLogementById(logementId: string): Observable<Logement> {
    return this.http.get<Logement>(`/api/logements/getLogementById`, {
      params: {
        logementId: logementId
      }
    });
  }

  public deleteLogement(logementId: string) {
    return this.http.get<Logement>(`/api/logements/delete`, {
      params: {
        logementId: logementId
      }
    });
  }

  public updateLogement(logement: Logement) {
    return this.http.post<Logement>(`/api/logements/update`, logement, {
      params: {
        logementId: logement._id
      }
    });
  }

  public deleteImage(logementId: string, imageIndex: string) {
    return this.http.get<Logement>(`/api/logements/deleteImage`, {
      params: {
        logementId: logementId,
        indexImage: imageIndex
      }
    });
  }

  public uploadPhotos(photos: FormData, logementId: string) {
    return this.http.post<Logement>(`/api/logements/uploadImages`, photos, {
      params: {
        logementId: logementId
      }
    });
  }

  public getLogementsByAnnonceur(email: string) {
    return this.http.get<Array<Logement>>(`/api/logements/getByAnnonceur`, {
      params: {
        emailAnnonceur: email
      }
    });
  }

  public getRecentsLogementForVille(ville: string) {
    return this.http.get<Logement>(`/api/logements/getRandomForVille`, {
      params: {
        ville: ville
      }
    }).subscribe((logement: Logement) => {
      if (logement !== null) {
        logement.indexImage = 0;
        let logements = this.logementsRandom.value;
        logements.push(logement);
        this.logementsRandom.next(logements);
      }
    });
  }

  public getLogementByFiltres(
    ville: string, 
    voyageurs: number, 
    lits: number, 
    sdbs: number, 
    prix: number,
    equipements: Array<string>
  ): Observable<Array<Logement>> {
    return this.http.get<Array<Logement>>(`/api/logements/getByFiltres`, {
      params: {
        ville: ville,
        voyageurs: voyageurs,
        lits: lits,
        sdbs: sdbs,
        prix: prix,
        equipements: equipements
      }
    });
  }

  public reserverLocation(logementReservation: LogementReservation): Observable<string>{
    return this.http.post<string>(`/api/logementReservation/create`, logementReservation);
  }

  public getReservationsByLogementId(logementId: string): Observable<Array<LogementReservation>>{
    return this.http.get<Array<LogementReservation>>(`/api/logementReservation/getReservationsByLogementId`, {
      params : {
        logementId : logementId
      }
    });
  }

  public getReservationsByDemandeurEmail(userEmail: string): Observable<Array<LogementReservation>>{
    return this.http.get<Array<LogementReservation>>(`/api/logementReservation/getReservationsByDemandeurEmail`, {
      params : {
        userEmail : userEmail
      }
    });
  }

  public getReservationsByAnnonceurEmail(userEmail: string): Observable<Array<LogementReservation>>{
    return this.http.get<Array<LogementReservation>>(`/api/logementReservation/getReservationsByAnnonceurEmail`, {
      params : {
        userEmail : userEmail
      }
    });
  }

  public getReservationByLogementReservationId(logementReservationId: string): Observable<LogementReservation>{
    return this.http.get<LogementReservation>(`/api/logementReservation/getReservationByLogementReservationId`, {
      params: {
        logementReservationId: logementReservationId
      }
    });
  }

  public confirmLogementReservation(logementReservationId: string): Observable<string>{
    return this.http.get<string>(`/api/logementReservation/accepteReservation`, {
      params: {
        logementReservationId: logementReservationId
      }
    });
  }

  public rejectLogementReservation(logementReservationId: string): Observable<string>{
    return this.http.get<string>(`/api/logementReservation/rejectReservation`, {
      params: {
        logementReservationId: logementReservationId
      }
    });
  }

  public cancelLogementReservationVoyageur(monCompteReservation: MonCompteVoyage, message: string){
    return this.http.post<string>(`/api/logementReservation/cancelReservationVoyageur`, {
      monCompteReservation: monCompteReservation,
      message: message
    });
  }

  public cancelLogementReservationHote(monCompteReservation: MonCompteReservation, message: string){
    return this.http.post<string>(`/api/logementReservation/cancelReservationHote`, {
      monCompteReservation: monCompteReservation,
      message: message
    },
    {
      params: {
        fromHost: "fromHost"
      }
    });
  }

}

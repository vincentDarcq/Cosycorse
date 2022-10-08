import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementReservation } from '../models/logementReservation';
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
      })
    }
  }

  public createLogement(logement: Logement): Observable<Logement> {
    return this.http.post<Logement>(`/api/logements/create`, logement);
  }

  public getLogementById(logementId: string): Logement | undefined {
    return this.logementsRandom.value.find(l => l._id === logementId);
  }

  public fetchLogementById(logementId: string) {
    return this.http.get<Logement>(`/api/logements/getLogementById`, {
      params: {
        logementId: logementId
      }
    })
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

  public getLogementsByAnnonceur(annonceur: string) {
    return this.http.get<Array<Logement>>(`/api/logements/getByAnnonceur`, {
      params: {
        annonceur: annonceur
      }
    });
  }

  // public getRecentsLogement() {
  //   return this.http.get<Array<Logement>>(`/api/logements/getRandom`).subscribe((logements: Array<Logement>) => {
  //     logements.forEach(l => {
  //       l.indexImage = 0;
  //     })
  //     this.logementsRandom?.next(logements);
  //   });
  // }

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
    return this.http.get<Array<LogementReservation>>(`/api/logementReservation/getReservations`, {
      params : {
        logementId : logementId
      }
    });
  }

}

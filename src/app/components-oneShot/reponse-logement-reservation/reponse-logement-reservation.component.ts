import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Logement } from 'src/app/models/logement';
import { LogementReservation } from 'src/app/models/logementReservation';
import { InfoService } from 'src/app/services/info.service';
import { LogementService } from 'src/app/services/logement.service';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-reponse-logement-reservation',
  templateUrl: './reponse-logement-reservation.component.html',
  styleUrls: ['./reponse-logement-reservation.component.scss']
})
export class ReponseLogementReservationComponent implements OnInit, OnDestroy {

  public subActivatedRoute?: Subscription;
  public subLogementService?: Subscription;
  idLogementReservation!: string;
  logementReservation!: LogementReservation;
  logement!: Logement;
  message!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService,
    private router: Router,
    private infoService: InfoService,
    private translator: TranslatorService
  ) {  }
 

  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.idLogementReservation = params['id'];
      this.subLogementService = this.logementService.getReservationByLogementReservationId(this.idLogementReservation).subscribe( 
        (logementReservation: LogementReservation) => { 
          this.logementReservation = logementReservation;
          this.logementService.fetchLogementById(this.logementReservation.logementId!).subscribe( (logement: Logement) => {
            this.logement = logement;
          })
        },
        err => {
          this.infoService.popupInfo(`${this.translate('REPONSE_LOGEMENT_RESERVATION.DEMANDE_TRAITEE')}`);
          this.router.navigate(['/']);
        }
      )
    })
  }

  accept(){
    this.subLogementService = this.logementService.confirmLogementReservation(this.idLogementReservation).subscribe( 
      (rep: string) => {
        this.infoService.popupInfo(this.translate(rep));
        this.router.navigate(['/']);
      }
    )
  }

  refuse(){
    this.subLogementService = this.logementService.rejectLogementReservation(this.idLogementReservation).subscribe(
      (rep: string) => {
        this.infoService.popupInfo(this.translate(rep));
        this.router.navigate(['/']);
      }
    )
  }

  translate(s: string): string {
    return this.translator.get(s);
  }

  ngOnDestroy(): void {
    if(this.subActivatedRoute){this.subActivatedRoute.unsubscribe();}
    if(this.subLogementService){this.subLogementService.unsubscribe();}
  }
}

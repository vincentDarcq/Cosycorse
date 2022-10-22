import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Logement } from 'src/app/models/logement';
import { LogementReservation } from 'src/app/models/logementReservation';
import { InfoService } from 'src/app/services/info.service';
import { LogementService } from 'src/app/services/logement.service';

@Component({
  selector: 'app-reponse-logement-reservation',
  templateUrl: './reponse-logement-reservation.component.html',
  styleUrls: ['./reponse-logement-reservation.component.scss']
})
export class ReponseLogementReservationComponent implements OnInit {

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
    private infoService: InfoService
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
          this.infoService.popupInfo("La demande de réservation a déjà été traitée");
          this.router.navigate(['/']);
        }
      )
    })
  }

  accept(){
    this.subLogementService = this.logementService.confirmLogementReservation(this.idLogementReservation).subscribe( 
      (rep: string) => {
        this.infoService.popupInfo(rep);
        this.router.navigate(['/']);
      }
    )
  }

  refuse(){
    this.subLogementService = this.logementService.rejectLogementReservation(this.idLogementReservation).subscribe(
      (rep: string) => {
        this.infoService.popupInfo(rep);
        this.router.navigate(['/']);
      }
    )
  }

}

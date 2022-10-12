import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementReservation } from '../models/logementReservation';
import { MonCompteReservation } from '../models/monCompteReservation';
import { User } from '../models/user.model';
import { LogementService } from '../services/logement.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.scss']
})
export class MonCompteComponent implements OnInit, OnDestroy {

  public subUser!: Subscription;
  public subReservations!: Subscription;
  public user!: User;
  monCompteReservations: Array<MonCompteReservation> = [];
  serverImg: String = "/upload?img=";

  constructor(
    private userService: UserService,
    private logementService: LogementService
  ) { }
  
  ngOnInit(): void {
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    this.subUser = this.userService.currentUser.subscribe( (user: User | null) => {
      this.user = new User(user?._id, user?.email, user?.name);
      this.subReservations = this.logementService.getReservationsByUserEmail(this.user.email).subscribe((logementReservations: Array<LogementReservation>) => {
        logementReservations.forEach(lr => {
          this.logementService.fetchLogementById(lr.logementId!).subscribe( (logement: Logement) => {
            logement.indexImage = 0;
            this.monCompteReservations.push(new MonCompteReservation(lr, logement));
          })
        })
      })
    })
  }

  selectArrow(mcr: Array<MonCompteReservation>, mcrIndex: number, index: number) {
    if (index < (this.monCompteReservations[mcrIndex].logement.images!.length - 1)) {
      mcr[mcrIndex].logement.indexImage++;
    }
  }

  selectLeftArrow(logements: Array<MonCompteReservation>, mcrIndex: number, index: number) {
    if (index > 0) {
      logements[mcrIndex].logement.indexImage--;
    }
  }

  annulerReservation(){}
  
  ngOnDestroy(): void {
    if(this.subUser){this.subUser.unsubscribe();}
    if(this.subReservations){this.subReservations.unsubscribe();}
  }
}

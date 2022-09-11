import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { LogementService } from '../services/logement.service';

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.scss']
})
export class LogementComponent implements OnInit, OnDestroy {

  public logement?: Logement;
  public subActivatedRoute?: Subscription;
  public subLogements?: Subscription;
  id?: string | null;
  serverImg: String = "/upload?img=";

  constructor(
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService
  ) { 

  }
  
  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      this.subLogements = this.logementService.logementsRandom.subscribe( (logements:Array<Logement>) => {
        if(logements.length > 0){
          this.logement = this.logementService.getLogementById(this.id!);
        }
      });
    });
  }
  
  ngOnDestroy(): void {
    if(this.subActivatedRoute){this.subActivatedRoute.unsubscribe()}
    if(this.subLogements){this.subLogements.unsubscribe()}
  }
}

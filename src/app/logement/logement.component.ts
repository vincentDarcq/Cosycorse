import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Subscription } from 'rxjs';
import { galleryImage } from '../models/galleryImage';
import { galleryOptions } from '../models/galleryOptons';
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
  id: string = "";
  serverImg: String = "/upload?img=";
  galleryOptions: NgxGalleryOptions[] = galleryOptions;

  constructor(
    private activatedRoute: ActivatedRoute,
    private logementService: LogementService
  ) {

  }

  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      this.subLogements = this.logementService.logementsRandom.subscribe((logements: Array<Logement>) => {
        if (logements.length > 0) {
          this.logement = this.logementService.getLogementById(this.id!);
          if (typeof this.logement === "undefined") {
            this.logementService.fetchLogementById(this.id).subscribe((logement: Logement) => {
              this.logement = logement;
              this.setGallery();
            })
          } else {
            this.setGallery();
          }
        }
      });
    });
  }

  setGallery() {
    this.logement!.galleryImages = [];
    this.logement?.images?.forEach(image => {
      this.logement?.galleryImages?.push(new galleryImage(this.serverImg + image, this.serverImg + image, this.serverImg + image))
    })
  }

  ngOnDestroy(): void {
    if (this.subActivatedRoute) { this.subActivatedRoute.unsubscribe() }
    if (this.subLogements) { this.subLogements.unsubscribe() }
  }
}

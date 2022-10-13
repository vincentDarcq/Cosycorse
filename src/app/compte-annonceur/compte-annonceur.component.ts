import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logement } from '../models/logement';
import { ModifyLogement } from '../models/modify-logement';
import { User } from '../models/user.model';
import { LogementService } from '../services/logement.service';
import { UserService } from '../services/user.service';
import { LogementsType } from '../models/logement-type';
import { Equipements } from '../models/equipements';
import { EquipementsSecurite } from '../models/equipementsSecurite';
import Swal from 'sweetalert2';
import { InfoService } from '../services/info.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-compte-annonceur',
  templateUrl: './compte-annonceur.component.html',
  styleUrls: ['./compte-annonceur.component.scss']
})
export class CompteAnnonceurComponent implements OnInit, OnDestroy {

  public subUser!: Subscription;
  public subLogements!: Subscription;
  public user!: User;
  adresses: Array<string> = [];
  modifyLogement: Array<ModifyLogement> = new Array();
  serverImg: String = "/upload?img=";
  indexNewImages: number = 0;
  logementsType = LogementsType;
  equipementsList = Equipements;
  equipementsSecuriteList = EquipementsSecurite;

  constructor(
    private logementService: LogementService,
    private userService: UserService,
    private infoService: InfoService,
    private scroller: ViewportScroller
  ) {
  }
  
  ngOnInit(): void {
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    this.subUser = this.userService.currentUser.subscribe( (user: User | null) => {
      this.user = new User(user?._id, user?.email, user?.name);
      this.subLogements = this.logementService.getLogementsByAnnonceur(this.user.name).subscribe( (logements: Array<Logement>) => {
        logements.forEach( (logement: Logement) => {
          const indexImages = typeof logement.images === "undefined" ? 0 : logement.images.length;
          this.modifyLogement.push(
            new ModifyLogement(logement, indexImages, new Array())
          )
          this.adresses.push(logement.adresse);
        })
      })
    })
  }

  onImageChange(event: any, indexLogement: number, indexImage: number){
    if (event.target.files[0]) {
      this.modifyLogement[indexLogement].formData.append('image'+indexImage, event.target.files[0]);
      this.modifyLogement[indexLogement].imagesLoaded[indexImage] = event.target.files[0].name;
    }
  }

  deleteImage(indexLogement: number, indexImage: number){
    this.logementService.deleteImage(this.modifyLogement[indexLogement].logement._id, indexImage.toString()).subscribe( (l: Logement) => {
      this.modifyLogement[indexLogement].logement = l;
    })
  }

  annulerModifierImage(indexLogement: number, indexImage: number){
    this.modifyLogement[indexLogement].formData.delete('image'+indexImage);
    this.modifyLogement[indexLogement].imagesLoaded[indexImage] = null;
  }

  onDropZone(event: any, indexLogement: number){
    this.modifyLogement[indexLogement].files.push(...event.addedFiles);
    this.fillFormData(indexLogement);
  }
  
  onRemove(event: any, indexLogement: number){
    this.modifyLogement[indexLogement].files.push(...event.addedFiles);
    this.fillFormData(indexLogement);
  }
  
  fillFormData(indexLogement: number){    
    for (let i = 0; i < this.modifyLogement[indexLogement].files.length; i++) {
      const index = i+1+this.modifyLogement[indexLogement].indexNewImages;
      this.modifyLogement[indexLogement].formData.append("image"+index, this.modifyLogement[indexLogement].files[i]);
    }
  }

  modifier(indexLogement: number){
    this.logementService.updateLogement(this.modifyLogement[indexLogement].logement).subscribe( (l: Logement) => {
      this.modifyLogement[indexLogement].logement = l;
      this.infoService.popupInfo(`votre annonce pour l'adresse ${l.adresse} a bien été modifiée`)
    })
    let addImage = false;
    for(let i = 1; i < 14; i++){
      if(this.modifyLogement[indexLogement].formData.has('image'+i)){
        addImage = true;
      }
    }
    if(addImage){
      this.logementService.uploadPhotos(this.modifyLogement[indexLogement].formData, this.modifyLogement[indexLogement].logement._id).subscribe( (l: Logement) => {
        this.modifyLogement[indexLogement].imagesLoaded = new Array();
        this.modifyLogement[indexLogement].files = new Array();
        this.modifyLogement[indexLogement].logement = l;
      })
    }
  }

  supprimer(indexLogement: number){
    Swal.fire({
      title: 'Supprimer votre annonce ?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {        
        this.logementService.deleteLogement(this.modifyLogement[indexLogement].logement._id).subscribe( () => {
          this.modifyLogement.splice(indexLogement, 1);
        })
      }
    })
  }

  navigaToAnnonce(adresse: string){
    this.scroller.scrollToAnchor(adresse);
  }
  
  ngOnDestroy(): void {
    if(this.subUser){this.subUser.unsubscribe();}
    if(this.subLogements){this.subLogements.unsubscribe();}
  }
}

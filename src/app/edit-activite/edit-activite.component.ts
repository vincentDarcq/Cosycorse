import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Activite } from '../models/activite';
import { ActivitesType } from '../models/type-activite';
import { Villes } from '../models/villes';
import { ActiviteService } from '../services/activite.service';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-edit-activite',
  templateUrl: './edit-activite.component.html',
  styleUrls: ['./edit-activite.component.scss']
})
export class EditActiviteComponent implements OnInit, OnDestroy {

  subRoute: Subscription;
  subfetch: Subscription;
  activite: Activite;
  serverImg: String = "/upload?img=";
  files: File[] = [];
  formData = new FormData();
  indexNewImages: number;
  activite_types = ActivitesType;
  villes = Villes;
  villeAutoComplete = Villes;

  constructor(
    private activiteService: ActiviteService,
    private activatedRoute: ActivatedRoute,
    private infoService: InfoService
  ) { }
  
  ngOnInit(): void {
    this.subRoute = this.activatedRoute.params.subscribe((params: any) => {
      if(this.activiteService.activites){
        this.activite = this.activiteService.activites.find(a => a._id === params.id);
        this.indexNewImages = this.activite.images.length;
      }
      if(!this.activite){
        this.subfetch = this.activiteService.fetchActivite(params.id).subscribe( (activite: Activite) => {
          this.activite = activite;
          this.indexNewImages = this.activite.images.length;
        });
      }
    })
  }

  onImageChange(event: any, indexImage: number){
    if (event.target.files[0]) {
      this.formData.append('image'+indexImage, event.target.files[0]);
      this.activiteService.uploadPhotos(this.formData, this.activite._id).subscribe(
        (activite: Activite) => {
          this.activite = activite;
          this.formData.delete('image'+indexImage);
        },
        err => {
          this.infoService.popupInfo(`Erreur au changement de l'image : ${err.error}`)
        }
      )
    }
  }

  deleteImage(indexImage: number){
    this.activiteService.deletePhoto(this.activite._id, indexImage.toString()).subscribe((activite: Activite) => {
      this.activite = activite;
      this.indexNewImages = activite.images.length;
    })
  }

  onDropZone(event: any){
    this.files.push(...event.addedFiles);
    this.fillFormData();
  }
  
  onRemove(event: any){
    this.files.splice(this.files.indexOf(event), 1);
    this.fillFormData();
  }
  
  fillFormData(){    
    for (let i = 0; i < this.files.length; i++) {
      const index = i+1+this.indexNewImages;
      this.formData.append("image"+index, this.files[i]);
    }
  }

  modifier(){
    this.activiteService.updateActivite(this.activite).subscribe((activite: Activite) => {
      this.activite = activite;
      this.infoService.popupInfo(`Lieu modifié avec succès !`)
    })
    let addImage = false;
    for(let i = 1; i < 14; i++){
      if(this.formData.has('image'+i)){
        addImage = true;
      }
    }
    if(addImage){
      this.activiteService.uploadPhotos(this.formData, this.activite._id).subscribe( (a: Activite) => {
        this.files = new Array();
        this.activite = a;
      })
    }
  }

  affineVille(){
    this.villeAutoComplete = this.villes.filter(v => v.toLowerCase().indexOf(this.activite.ville.toLowerCase()) !== -1)
    if(this.activite.ville.length === 0){
      this.villeAutoComplete = this.villes;
    }
  }
  
  ngOnDestroy(): void {
    if(this.subRoute){this.subRoute.unsubscribe();}
    if(this.subfetch){this.subfetch.unsubscribe();}
  }
}

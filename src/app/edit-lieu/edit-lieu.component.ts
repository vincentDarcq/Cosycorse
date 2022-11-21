import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Lieu } from '../models/lieu';
import { LieusType } from '../models/type-lieu';
import { Villes } from '../models/villes';
import { InfoService } from '../services/info.service';
import { LieuService } from '../services/lieu.service';

@Component({
  selector: 'app-edit-lieu',
  templateUrl: './edit-lieu.component.html',
  styleUrls: ['./edit-lieu.component.scss']
})
export class EditLieuComponent implements OnInit, OnDestroy{

  subRoute: Subscription;
  subfetch: Subscription;
  lieu: Lieu;
  serverImg: String = "/upload?img=";
  files: File[] = [];
  formData = new FormData();
  indexNewImages: number;
  lieu_types = LieusType;
  villes = Villes;
  villeAutoComplete = Villes;

  constructor(
    private lieuService: LieuService,
    private activatedRoute: ActivatedRoute,
    private infoService: InfoService
  ) { }

  ngOnInit(): void {
    this.subRoute = this.activatedRoute.params.subscribe((params: any) => {
      if(this.lieuService.lieux){
        this.lieu = this.lieuService.lieux.find(l => l._id === params.id);
        this.indexNewImages = this.lieu.images.length;
      }
      if(!this.lieu){
        this.subfetch = this.lieuService.fetchLieu(params.id).subscribe( (lieu: Lieu) => {
          this.lieu = lieu;
          this.indexNewImages = this.lieu.images.length;
        });
      }
    })
  }

  onImageChange(event: any, indexImage: number){
    if (event.target.files[0]) {
      this.formData.append('image'+indexImage, event.target.files[0]);
      this.lieuService.uploadPhotos(this.formData, this.lieu._id).subscribe(
        (lieu: Lieu) => {
          this.lieu = lieu;
          this.formData.delete('image'+indexImage);
        },
        err => {
          this.infoService.popupInfo(`Erreur au changement de l'image : ${err.error}`)
        }
      )
    }
  }

  deleteImage(indexImage: number){
    this.lieuService.deletePhoto(this.lieu._id, indexImage.toString()).subscribe((lieu: Lieu) => {
      this.lieu = lieu;
      this.indexNewImages = lieu.images.length;
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
    this.lieuService.updateLieu(this.lieu).subscribe((lieu: Lieu) => {
      this.lieu = lieu;
      this.infoService.popupInfo(`Lieu modifié avec succès !`)
    })
    let addImage = false;
    for(let i = 1; i < 14; i++){
      if(this.formData.has('image'+i)){
        addImage = true;
      }
    }
    if(addImage){
      this.lieuService.uploadPhotos(this.formData, this.lieu._id).subscribe( (l: Lieu) => {
        this.files = new Array();
        this.lieu = l;
      })
    }
  }

  affineVille(){
    this.villeAutoComplete = this.villes.filter(v => v.toLowerCase().indexOf(this.lieu.ville.toLowerCase()) !== -1)
    if(this.lieu.ville.length === 0){
      this.villeAutoComplete = this.villes;
    }
  }

  ngOnDestroy(): void {
    if(this.subRoute){this.subRoute.unsubscribe();}
    if(this.subfetch){this.subfetch.unsubscribe();}
  }

}

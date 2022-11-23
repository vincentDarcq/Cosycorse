import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Map, MapOptions, marker } from 'leaflet';
import { Activite } from '../models/activite';
import { ActivitesType } from '../models/type-activite';
import { Villes } from '../models/villes';
import { ActiviteService } from '../services/activite.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-activite-form',
  templateUrl: './activite-form.component.html',
  styleUrls: ['./activite-form.component.scss']
})
export class ActiviteFormComponent implements OnInit {

  form: FormGroup;
  displayMap: boolean = false;
  map!: Map;
  lastLayer: any;
  files: File[] = [];
  formData = new FormData();
  mapOptions!: MapOptions;
  villes = Villes;
  villeAutoComplete = Villes;
  activites_types = ActivitesType;

  @ViewChild("latitude") private latitude!: ElementRef;
  @ViewChild("longitude") private longitude!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private mapService: MapService,
    private activiteService: ActiviteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titre: ['', Validators.required],
      proposeur: ['', Validators.required],
      type: ['', Validators.required],
      duree: ['', Validators.required],
      ville: ['', Validators.required],
      description: '',
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
    this.initializeMap();
  }

  affineVille(){
    this.villeAutoComplete = this.villes.filter(v => v.toLowerCase().indexOf(this.form.value.ville.toLowerCase()) !== -1)
    if(this.form.value.ville.length === 0){
      this.villeAutoComplete = this.villes;
    }
  }

  onMapReady(map: Map){
    this.map = map;
    this.map.on('click', (e) => {
      this.zone.run(() => {
        const coord = e.latlng;
        this.latitude.nativeElement.value = coord.lat;
        this.longitude.nativeElement.value = coord.lng;
        this.form.value.latitude = coord.lat;
        this.form.value.longitude = coord.lng;
        this.form.controls['latitude'].setValue(coord.lat);
        this.form.controls['longitude'].setValue(coord.lng);
        if(this.lastLayer && this.map.hasLayer(this.lastLayer)){
          this.map.removeLayer(this.lastLayer);
        }
        const mapPoint = this.mapService.newPoint(coord.lat, coord.lng);
        const point = this.mapService.createPoint(mapPoint)
        this.lastLayer = marker(point).setIcon(this.mapService.getRedIcon()).addTo(this.map);
      })
    })
  }

  private initializeMap() {
    this.mapOptions = this.mapService.initializeCorseMap();
    this.displayMap = true;
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
      this.formData.append("image"+(i+1), this.files[i], this.files[i].name);
    }
  }

  submit(){
    let activite = new Activite();
    activite.description = this.form.value.description;
    activite.duree = this.form.value.duree;
    activite.latitude = this.form.value.latitude;
    activite.longitude = this.form.value.longitude;
    activite.proposeur = this.form.value.proposeur;
    activite.titre = this.form.value.titre;
    activite.type = this.form.value.type;
    activite.ville = this.form.value.ville;
    this.activiteService.createActivite(activite).subscribe((activite:Activite) => {
      let addImage = false;
      for(let i = 1; i < 14; i++){
        if(this.formData.has('image'+i)){
          addImage = true;
        }
      }
      if(addImage){
        this.activiteService.uploadPhotos(this.formData, activite._id).subscribe( (a: Activite) => {
          this.router.navigate(['/']);
        })
      }else {
        this.router.navigate(['/']);
      }
    })
  }

}

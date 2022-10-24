import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Map, MapOptions, marker } from 'leaflet';
import { LieuService } from '../services/lieu.service';
import { MapService } from '../services/map.service';
import { Villes } from '../models/villes';
import { LieusType } from '../models/type-lieu';
import { Lieu } from '../models/lieu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lieux-form',
  templateUrl: './lieux-form.component.html',
  styleUrls: ['./lieux-form.component.scss']
})
export class LieuxFormComponent implements OnInit {

  form!: FormGroup;
  formData = new FormData();
  files: File[] = [];
  displayMap: boolean = false;
  mapOptions!: MapOptions;
  map!: Map;
  villes = Villes;
  lieu_types = LieusType;
  villeAutoComplete = Villes;
  lastLayer: any;

  @ViewChild("latitude") private latitude!: ElementRef;
  @ViewChild("longitude") private longitude!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private lieuService: LieuService,
    private zone: NgZone,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      ville: ['', Validators.required],
      type: ['', Validators.required],
      description: '',
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
    this.initializeMap();
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

  affineVille(){
    this.villeAutoComplete = this.villes.filter(v => v.toLowerCase().indexOf(this.form.value.ville.toLowerCase()) !== -1)
    if(this.form.value.ville.length === 0){
      this.villeAutoComplete = this.villes;
    }
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
    const lieu = new Lieu();
    lieu.description = this.form.value.description;
    lieu.latitude = this.form.value.latitude;
    lieu.longitude = this.form.value.longitude;
    lieu.longitude = this.form.value.longitude;
    lieu.nom = this.form.value.nom;
    lieu.type = this.form.value.type;
    lieu.ville = this.form.value.ville;
    this.lieuService.createLieu(lieu).subscribe((lieu: Lieu) => {
      this.lieuService.uploadPhotos(this.formData, lieu._id).subscribe((lieu: Lieu) => {
        this.router.navigate(['/']);
      })
    })
  }

}

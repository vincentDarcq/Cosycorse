import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Map, MapOptions } from 'leaflet';
import { LieuService } from '../services/lieu.service';
import { MapService } from '../services/map.service';
import { Villes } from '../models/villes';

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
  villeAutoComplete = Villes;

  @ViewChild("latitude") private latitude!: ElementRef;
  @ViewChild("longitude") private longitude!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private lieuService: LieuService,
    private zone: NgZone,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
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

  }

}

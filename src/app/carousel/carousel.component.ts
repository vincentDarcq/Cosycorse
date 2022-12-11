import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Section } from '../models/sections';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnChanges {

  @Input() sections: Array<Section>;
  serverImg: String = "/upload?img=";

  constructor() { }
  
  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}

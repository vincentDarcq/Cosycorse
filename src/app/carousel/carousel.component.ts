import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Section } from '../models/sections';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {

  @Input() sections: Array<Section>;
  serverImg: String = "/upload?img=";

  constructor() { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    console.log(this.sections);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActiviteInOutAnimation } from '../animations/activiteDescriptionInOut';
import { LieuInOutAnimation } from '../animations/lieuDescriptionInOut';
import { TranslatorService } from '../services/translator.service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  animations: [ActiviteInOutAnimation, LieuInOutAnimation]
})
export class ItemCardComponent implements OnInit {

  @Input() items: Array<any>;
  serverImg: String = "/upload?img=";

  constructor(
    private translator: TranslatorService
  ) { }

  ngOnInit(): void {
  }

  expandDescription(animationState: string, index: number){
    for(let i = 0; i < this.items.length; i++){
      if(i !== index){
        this.items[i].animationState = 'false';
      }
    }
    this.items[index].animationState = animationState === 'false' ? 'true' : 'false';
  }

  selectArrow(indexActivite: number, index: number, event: any) {
    event.stopPropagation()
    if (index < (this.items[indexActivite].images!.length - 1)) {
      this.items[indexActivite].indexImage++;
    }
  }

  selectLeftArrow(indexActivite: number, index: number, event: any) {
    event.stopPropagation()
    if (index > 0) {
      this.items[indexActivite].indexImage--;
    }
  }

  translate(s: string): string {
    return this.translator.get(s);
  }

}

import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [
    trigger("fade", [
      transition("false=>true", [
        style({ opacity: 1 }),
        animate("2500ms", style({ opacity: 1 }))
      ]),
      transition("true=>false", [
        style({ opacity: 1 }),
        animate("1500ms", style({ opacity: 0.7 }))
      ])
    ])
  ]
})
export class MainPageComponent implements OnInit {
  ngOnInit(): void {

  }

  imageArray1 = [
    "../../assets/cosycorseimage01.png",
    "../../assets/cosycorseimage02.png"
  ];

  imageArray2 = [
    "../../assets/cosycorseimage03.png",
    "../../assets/cosycorseimage04.png"
  ];

  imageArray3 = [
    "../../assets/cosycorseimage05.png",
    "../../assets/cosycorseimage06.png"
  ];

  imageArray4 = [
    "../../assets/cosycorseimage07.png",
    "../../assets/cosycorseimage08.png"
  ];

  imageArray5 = [
    "../../assets/cosycorseimage09.png",
    "../../assets/cosycorseimage10.png"
  ];

  imageArray6 = [
    "../../assets/cosycorseimage11.png",
    "../../assets/cosycorseimage12.png"
  ];

  imageArray7 = [
    "../../assets/cosycorseimage13.png",
    "../../assets/cosycorseimage14.png"
  ];

  imageArray8 = [
    "../../assets/cosycorseimage15.png",
    "../../assets/cosycorseimage16.png"
  ];

  imageArray9 = [
    "../../assets/cosycorseimage17.png",
    "../../assets/cosycorseimage18.png"
  ];

  imageArray10 = [
    "../../assets/cosycorseimage19.png",
    "../../assets/cosycorseimage20.png"
  ];

  imageArray11 = [
    "../../assets/cosycorseimage21.png",
    "../../assets/cosycorseimage22.png"
  ];

  toogle = false;
  count: number = 0;

  toogle2 = true;
  count2: number = 0;
  onFade(event: any) {
      if (event.fromState)
        this.count = (this.count + 1) % 2;
      this.toogle = !this.toogle;
  }

}

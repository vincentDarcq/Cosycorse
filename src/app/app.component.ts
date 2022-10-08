import { Component } from '@angular/core';
import { MetaAndTitleService } from './services/meta-and-title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cosycorse';

  constructor(
    private metaAndTitleService: MetaAndTitleService
  ){

  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import metaData from '../models/meta-data';

@Injectable({
  providedIn: 'root'
})
export class MetaAndTitleService implements OnDestroy {

  private subscription = new Subscription

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) { 
    this.subscription.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.update(url);
      }
    }));
  }
  
  private update(url: string): void {
    const oldTagDescription = this.meta.getTag('name="description"');
    let newTagDescription = {};
    const urlSegment = url.split("/")
    const field: String = urlSegment[1] ? urlSegment[1] : "";
    switch(field){
      case '':
        this.title.setTitle(metaData['/'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'creation_annonce':
        this.title.setTitle(metaData['/creation_annonce'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'creation_compte':
        this.title.setTitle(metaData['/creation_compte'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'logements':
        this.title.setTitle(metaData['/logements'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'logement':
        this.title.setTitle(metaData['/logement'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'mon_compte':
        this.title.setTitle(metaData['/mon_compte'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'connexion':
        this.title.setTitle(metaData['/connexion'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
      case 'activites':
        this.title.setTitle(metaData['/activites'].title);
        newTagDescription = {
          name: 'description',
          content: metaData['/'].metas.description
        }
        break;
    }
    oldTagDescription
      ? this.meta.updateTag(newTagDescription)
      : this.meta.addTag(newTagDescription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

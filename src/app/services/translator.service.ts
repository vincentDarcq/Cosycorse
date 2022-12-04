import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  constructor(public translate: TranslateService) {
    const lang = localStorage.getItem('language') !== null ? localStorage.getItem('language') : 'Français';
    translate.use(lang);
    localStorage.setItem('language', lang);
  }

  public getLang(): string {
    const lang = localStorage.getItem('language')
    if (lang !== undefined && lang !== null) {
      return lang;
    }
    return 'Français';
  }

  public setLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  public get(key: string): string {
    let text = '';
    this.translate.get(key).subscribe(
      translation => {
        text = translation;
      });
    return text;
  }
}

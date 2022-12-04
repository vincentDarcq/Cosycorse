import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailContactLogement } from '../models/mailContactLogement';

@Injectable({
  providedIn: 'root'
})
export class MailsService {

  constructor(private http: HttpClient) { }

  public contactHost(mail: MailContactLogement): Observable<string> {
    return this.http.post<string>(`/api/mails/contactHost`, mail);
  }

}

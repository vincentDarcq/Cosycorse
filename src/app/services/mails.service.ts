import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailContactLogement } from '../models/mailContactLogement';

@Injectable({
  providedIn: 'root'
})
export class MailsService {

  constructor(private http: HttpClient) { }

  public sendMail(mail: MailContactLogement): Observable<String> {
    return this.http.post<String>(`/api/mails/send-email`, mail);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestCosycorse } from '../models/requestCosycorse';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient
  ) { }

  public sendRequestCosycorse(request: RequestCosycorse): Observable<string>{
    return this.http.post<string>(`/api/mails/contact`, request);
  }
}

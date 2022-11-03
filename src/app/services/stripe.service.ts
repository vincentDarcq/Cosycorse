import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private http: HttpClient
  ) { }

  public setUpPaiement(): Observable<string>{
    return this.http.get<string>(`/api/stripe/paiments/setup`);
  }

  public finalizeSetUpPaiement(code: string): Observable<any>{
    return this.http.get<any>(`/api/stripe/paiments/response/setup`, {
      params: {
        code: code
      }
    });
  }

  public createPaiementIntent(customerId: string, logementId: string, nuits: number, paymentMethodId: string): Observable<any>{
    return this.http.get<any>(`/api/stripe/paiments/create-payment-intent`, {
      params: {
        customerId: customerId,
        logementId: logementId,
        nuits: nuits,
        paymentMethodId: paymentMethodId
      }
    });
  }

  public getConfig(): Observable<any> {
    return this.http.get<any>(`/api/stripe/config`);
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtToken } from '../models/jwt-token.model';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const path = route.url[0].path;
      if(path){
        sessionStorage.setItem('redirectUrl', path);
      }
      return this.authService.jwtToken.pipe(
        map((jwtToken: JwtToken) => {
          return jwtToken.isAuthenticated! ? true : this.router.createUrlTree(["/connexion"]);
        })
      );
  }
  
}

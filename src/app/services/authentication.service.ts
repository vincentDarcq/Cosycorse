import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public jwtToken: BehaviorSubject<any> = new BehaviorSubject({
    isAuthenticated: sessionStorage.getItem('jwt') ? true : false,
    token: sessionStorage.getItem('jwt') ? sessionStorage.getItem('jwt') : null,
  });

  private signupSub!: Subscription;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  public signup(user: User){
    return this.http.post<User>(`/api/auth/signup`, user);
  }

  public login(user: User){
    return this.http.post<string>(`/api/auth/signin`, user).pipe(
      tap((token: string) => {
        this.jwtToken.next({
          isAuthenticated: true,
          token: token,
        });
        sessionStorage.setItem('jwt', token);
        this.userService.getCurrentUser();
      })
    );;
  }

  public logOut(){
    this.jwtToken.next({
      isAuthenticated: false,
      token: null,
    });
    sessionStorage.removeItem('jwt');
    this.userService.logOut();
  }

  public authentForResetPwd(token: string){
    return this.http.get<User>("/api/auth/authent-withToken", {
      params: {
        token: token
      }
    })
  }

}

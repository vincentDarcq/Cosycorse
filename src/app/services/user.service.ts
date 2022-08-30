import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{

  public currentUser: BehaviorSubject<User> = new BehaviorSubject(new User());
  public subscription!: Subscription;

  constructor(private http: HttpClient) { }
  
  getCurrentUser() {
    this.subscription = this.http.get<User>('/api/auth/current').subscribe((user: User) => {
      this.currentUser.next(user);
    });
  }
  
  logOut(){
    this.currentUser.next(new User());
  }

  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
  }
}

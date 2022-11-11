import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public subscription!: Subscription;
  public user!: User
  public list: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    this.authService.jwtToken.subscribe((jwt : {isAuthenticated: boolean, token: string}) => {
      this.isAuthenticated = jwt.isAuthenticated;
    })
    this.subscription = this.userService.currentUser.subscribe( (user: any) => {
      this.user = new User(user._id, user.email, user.firstName, user.lastName);
    })
  }
  
  logOut(){
    this.authService.logOut();
    this.displayList();
  }
  
  displayList(){
    this.list = !this.list;
  }
  
  ngOnDestroy(): void {
    if(this.subscription){this.subscription.unsubscribe();}
  }
}

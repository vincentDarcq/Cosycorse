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

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    this.subscription = this.userService.currentUser.subscribe( (user: User | null) => {
      this.user = new User(user?._id, user?.email, user?.name);
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

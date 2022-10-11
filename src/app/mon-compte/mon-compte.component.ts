import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.component.html',
  styleUrls: ['./mon-compte.component.scss']
})
export class MonCompteComponent implements OnInit {

  public subUser!: Subscription;
  public user!: User;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("redirectUrl")){
      sessionStorage.removeItem("redirectUrl")
    }
    this.subUser = this.userService.currentUser.subscribe( (user: User | null) => {
      this.user = new User(user?._id, user?.email, user?.name);
    })
  }

}

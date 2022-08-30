import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public nom: string = "";
  public password: string = "";
  public email: string = "";
  signupSub!: Subscription;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  createAccount(){
    let user = new User();
    user.setEmail(this.email);
    user.setName(this.nom);
    user.setPasword(this.password);
    this.signupSub = this.authenticationService.signup(user).subscribe( (user: User) => {
      console.log("signup successfully as ", user)
    })
  }

}

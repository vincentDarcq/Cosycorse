import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public nom: string = "";
  public password: string = "";
  loginSub!: Subscription;
  error!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    let user = new User();
    user.setName(this.nom);
    user.setPasword(this.password);
    this.loginSub = this.authenticationService.login(user).subscribe( () => {
      this.router.navigate(['/']);
    }, err => {
      this.error = err.error;
    })
  }

}

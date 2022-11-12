import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  signupSub!: Subscription;
  erreur: string;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  createAccount(){
    let user = new User();
    user.email = this.form.value.email;
    user.nom = this.form.value.nom;
    user.prenom = this.form.value.prenom;
    user.email = this.form.value.email;
    user.password = this.form.value.password;
    this.signupSub = this.authenticationService.signup(user).subscribe( 
      () => {
        this.router.navigate(['/']);
      },
      err => {
        this.erreur = err.error;
      }
    )
  }

}

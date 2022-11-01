import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { PopupResetPasswordComponent } from '../popups/popup-reset-password/popup-reset-password.component';
import { AuthenticationService } from '../services/authentication.service';
import { InfoService } from '../services/info.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loginSub!: Subscription;
  error!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private infoService: InfoService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(){
    let user = new User();
    user.email = this.form.value.email;
    user.password = this.form.value.password;
    this.loginSub = this.authenticationService.login(user).subscribe( () => {
      if(sessionStorage.getItem("redirectUrl")){
        this.router.navigate([sessionStorage.getItem("redirectUrl")]);
      }else {
        this.router.navigate(['/']);
      }
    }, err => {
      this.error = err.error;
    })
  }

  openPopupResetMdp(){
    const dialogRef = this.dialog.open(PopupResetPasswordComponent, {
      width: '300px',
      data: "",
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userService.forgotPassword(result.mail).subscribe( (res: string) => {
        this.infoService.popupInfo(res);
      })
    });
  }

}

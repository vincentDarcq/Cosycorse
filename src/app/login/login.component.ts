import { Component, OnInit } from '@angular/core';
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

  public nom: string = "";
  public password: string = "";
  loginSub!: Subscription;
  error!: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private infoService: InfoService,
    private router: Router,
    private dialog: MatDialog
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

  openPopupResetMdp(){
    const dialogRef = this.dialog.open(PopupResetPasswordComponent, {
      width: '300px',
      data: "",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result.mail)
      this.userService.resetPassword(result.mail).subscribe( (res: string) => {
        console.log(res)
        this.infoService.popupInfo(res);
      })
    });
  }

}

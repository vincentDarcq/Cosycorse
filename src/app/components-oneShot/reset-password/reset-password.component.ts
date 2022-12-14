import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatorService } from 'src/app/services/translator.service';
import { ResetPassword } from '../../models/resetPassword';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { InfoService } from '../../services/info.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public subActivatedRoute?: Subscription;
  token!: string;
  user!: User;
  error?: string;
  form!: FormGroup;

  @ViewChild('password') public pass!: ElementRef;
  @ViewChild('confirmPassword') public confirmPass!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authentService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private infoService: InfoService,
    private translator: TranslatorService
  ) { }
  
  ngOnInit(): void {
    this.subActivatedRoute = this.activatedRoute.params.subscribe((params: any) => {
      this.token = params['token'];
      this.authentService.authentForResetPwd(this.token).subscribe( 
        (user: any) => {
          this.user = new User(user._id, user.email, user.firstName, user.lastName);
        },
        err => {
          this.error = this.translate(err);
        }
      )
    },
    err => {
      this.error = err;
    });
    this.form = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: this.confirmedValidator('password', 'confirmPassword')
      } as AbstractControlOptions);
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  displayPass(){
    this.pass.nativeElement.type = "text";
  }

  displayConfirmPass(){
    this.confirmPass.nativeElement.type = "text";
  }

  hidePass(){
    this.pass.nativeElement.type = "password";
  }

  hideConfirmPass(){
    this.confirmPass.nativeElement.type = "password";
  }

  submit(){
    this.userService.resetPassword(this.form.value).subscribe( 
      (user: User) => {
        this.infoService.popupInfo(`${this.translate('RESET_PASS.SUCCESS')}`);
      },
      err => {
        this.infoService.popupInfo(`${this.translate('CONTACT.ERROR')} ${err}`);
      }
    )
  }

  translate(s: string): string {
    return this.translator.get(s);
  }
  
  ngOnDestroy(): void {
    if(this.subActivatedRoute){this.subActivatedRoute.unsubscribe();};
  }

}

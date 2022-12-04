import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './login/login.component';

//Material
import { AngularMaterialModule } from './material/angular-material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LogementsComponent } from './logements/logements.component';
import { ActivitesComponent } from './activites/activites.component';
import { LieuxComponent } from './lieux/lieux.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';
import { SignupComponent } from './signup/signup.component';
import { AnnonceFormComponent } from './annonce-form/annonce-form.component';
import { LogementComponent } from './logement/logement.component';
import { PopupContacterLogementAnnonceComponent } from './popups/popup-contacter-logement-annonce/popup-contacter-logement-annonce.component';
import { PopupReservationLogementComponent } from './popups/popup-reservation-logement/popup-reservation-logement.component';
import { PopupResetPasswordComponent } from './popups/popup-reset-password/popup-reset-password.component';
import { ResetPasswordComponent } from './components-oneShot/reset-password/reset-password.component';
import { ReponseLogementReservationComponent } from './components-oneShot/reponse-logement-reservation/reponse-logement-reservation.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { LieuxFormComponent } from './lieux-form/lieux-form.component';
import { StripeRedirectComponent } from './components-oneShot/stripe-redirect/stripe-redirect.component';
import { AnnulerVoyageComponent } from './popups/annuler-voyage/annuler-voyage.component';
import { AnnulerReservationComponent } from './popups/annuler-reservation/annuler-reservation.component';
import { RouterExtService } from './services/router-ext.service';
import { EditLieuComponent } from './edit-lieu/edit-lieu.component';
import { ActiviteFormComponent } from './activite-form/activite-form.component';
import { EditActiviteComponent } from './edit-activite/edit-activite.component';
import { ContactComponent } from './contact/contact.component';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogementsComponent,
    ActivitesComponent,
    LieuxComponent,
    MainPageComponent,
    LoginComponent,
    SignupComponent,
    AnnonceFormComponent,
    MesAnnoncesComponent,
    LogementComponent,
    PopupContacterLogementAnnonceComponent,
    PopupReservationLogementComponent,
    PopupResetPasswordComponent,
    ResetPasswordComponent,
    MonCompteComponent,
    ReponseLogementReservationComponent,
    LieuxFormComponent,
    StripeRedirectComponent,
    AnnulerVoyageComponent,
    AnnulerReservationComponent,
    EditLieuComponent,
    ActiviteFormComponent,
    EditActiviteComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
    NgxMaterialTimepickerModule,
    FlexLayoutModule,
    LeafletModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxGalleryModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      //multi à true pour préciser qu'il y a d'autres elements à provide ensuite
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { 
  constructor(private routerExtService: RouterExtService){}
}

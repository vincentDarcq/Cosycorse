import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { CompteAnnonceurComponent } from './compte-annonceur/compte-annonceur.component';
import { SignupComponent } from './signup/signup.component';
import { AnnonceFormComponent } from './annonce-form/annonce-form.component';
import { LogementComponent } from './logement/logement.component';
import { PopupContacterLogementAnnonceComponent } from './popups/popup-contacter-logement-annonce/popup-contacter-logement-annonce.component';
import { PopupReservationLogementComponent } from './popups/popup-reservation-logement/popup-reservation-logement.component';

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
    CompteAnnonceurComponent,
    LogementComponent,
    PopupContacterLogementAnnonceComponent,
    PopupReservationLogementComponent
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
    NgxGalleryModule
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
export class AppModule { }

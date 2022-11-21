import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitesComponent } from './activites/activites.component';
import { AnnonceFormComponent } from './annonce-form/annonce-form.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';
import { AuthGuard } from './guards/auth.guard';
import { LieuxComponent } from './lieux/lieux.component';
import { LogementComponent } from './logement/logement.component';
import { LogementsComponent } from './logements/logements.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { ResetPasswordComponent } from './components-oneShot/reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { ReponseLogementReservationComponent } from './components-oneShot/reponse-logement-reservation/reponse-logement-reservation.component';
import { LieuxFormComponent } from './lieux-form/lieux-form.component';
import { StripeRedirectComponent } from './components-oneShot/stripe-redirect/stripe-redirect.component';
import { EditLieuComponent } from './edit-lieu/edit-lieu.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'logements', component: LogementsComponent },
  { path: 'logement/:id', component: LogementComponent},
  { path: 'edit-lieu/:id', component: EditLieuComponent},
  { path: 'activites', component: ActivitesComponent },
  { path: 'lieux', component: LieuxComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'creation_compte', component: SignupComponent},
  { path: 'creation_annonce', canActivate: [AuthGuard], component: AnnonceFormComponent},
  { path: 'mon_compte', canActivate: [AuthGuard], component: MonCompteComponent},
  { path: 'mes_annonces', canActivate: [AuthGuard], component: MesAnnoncesComponent},
  { path: 'creation_lieu', canActivate: [AuthGuard], component: LieuxFormComponent},
  { path: 'reset_password/:token', component: ResetPasswordComponent},
  { path: 'reponseLogementReservation/:id', component: ReponseLogementReservationComponent},
  { path: 'stripe/redirect', component: StripeRedirectComponent},
  { path: '**', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitesComponent } from './activites/activites.component';
import { AnnonceFormComponent } from './annonce-form/annonce-form.component';
import { CompteAnnonceurComponent } from './compte-annonceur/compte-annonceur.component';
import { AuthGuard } from './guards/auth.guard';
import { LieuxComponent } from './lieux/lieux.component';
import { LogementComponent } from './logement/logement.component';
import { LogementsComponent } from './logements/logements.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MonCompteComponent } from './mon-compte/mon-compte.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'logements', component: LogementsComponent },
  { path: 'activites', component: ActivitesComponent },
  { path: 'lieux', component: LieuxComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'creation_compte', component: SignupComponent},
  { path: 'creation_annonce', canActivate: [AuthGuard], component: AnnonceFormComponent},
  { path: 'mes_annonces/:id', canActivate: [AuthGuard], component: CompteAnnonceurComponent},
  { path: 'mon_compte/:id', canActivate: [AuthGuard], component: MonCompteComponent},
  { path: 'reset_password/:token', component: ResetPasswordComponent},
  { path: 'logement/:id', component: LogementComponent},
  { path: '', component: MainPageComponent },
  { path: '**', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

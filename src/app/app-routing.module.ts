import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitesComponent } from './activites/activites.component';
import { AnnonceFormComponent } from './annonce-form/annonce-form.component';
import { CompteAnnonceurComponent } from './compte-annonceur/compte-annonceur.component';
import { LieuxComponent } from './lieux/lieux.component';
import { LogementsComponent } from './logements/logements.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'logements', component: LogementsComponent },
  { path: 'activites', component: ActivitesComponent },
  { path: 'lieux', component: LieuxComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'creation_compte', component: SignupComponent},
  { path: 'creation_annonce', component: AnnonceFormComponent},
  { path: 'mon_compte', component: CompteAnnonceurComponent},
  { path: '', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

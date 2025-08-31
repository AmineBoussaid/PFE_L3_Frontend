import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { ServicesComponent } from './services/services.component';
import { HistoriqueComponent } from './historique/historique.component';
import { InterventionComponent } from './intervention/intervention.component';
import { ProfileComponent } from './profile/profile.component';
import { GestionDepartementComponent } from './gestion-departement/gestion-departement.component';
import { AllTechniciensComponent } from './gestion-departement/all-techniciens/all-techniciens.component';
import { AllEquipesComponent } from './gestion-departement/all-equipes/all-equipes.component';

export const ChefDepartementRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'intervention', component: InterventionComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'gestion-departement',component: GestionDepartementComponent },
  { path: 'gestion-departement/all-techniciens',component: AllTechniciensComponent },
  { path: 'gestion-departement/all-equipes',component: AllEquipesComponent},


  { path: '', redirectTo: 'services', pathMatch: 'full' } // Redirection par défaut vers le dashboard
];

@NgModule({
  imports: [RouterModule.forChild(ChefDepartementRoutes)],
  exports: [RouterModule]
})
export class ChefdepartementRoutingModule { }

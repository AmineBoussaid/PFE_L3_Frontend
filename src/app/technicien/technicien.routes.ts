import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { InterventionComponent } from './intervention/intervention.component';
import { HistoriqueComponent } from './historique/historique.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

export const TechnicienRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'intervention', component: InterventionComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'profile', component: ProfileComponent },

  { path: '', redirectTo: 'services', pathMatch: 'full' } // Redirection par défaut vers le dashboard

];;

@NgModule({
  imports: [RouterModule.forChild(TechnicienRoutes)],
  exports: [RouterModule]
})
export class TechnicienRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { HistoriqueComponent } from '../share/historique/historique.component';

export const AgentRoutes: Routes = [

  { path: 'dashboard', component: DashboardComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'profile', component: ProfileComponent },

  { path: '', redirectTo: 'services', pathMatch: 'full' } // Redirection par défaut vers le dashboard

];

@NgModule({
  imports: [RouterModule.forChild(AgentRoutes)],
  exports: [RouterModule]
})

export class AgentRoutingModule { }

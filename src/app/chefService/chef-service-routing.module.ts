import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoriqueComponent } from './historique/historique.component';
import { InterventionComponent } from './intervention/intervention.component';

export const ChefServiceRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'intervention', component: InterventionComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirection par défaut vers le dashboard

];

@NgModule({
  imports: [RouterModule.forChild(ChefServiceRoutes)],
  exports: [RouterModule]
})
export class ChefServiceRoutingModule { }

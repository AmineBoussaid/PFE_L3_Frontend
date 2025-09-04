import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InterventionComponent } from './intervention/intervention.component';
import { ProfileComponent } from './profile/profile.component';
import { GestionServiceComponent } from './gestion-service/gestion-service.component';
import { AllTechniciensComponent } from './gestion-service/all-techniciens/all-techniciens.component';
import { AllEquipesComponent } from './gestion-service/all-equipes/all-equipes.component';
import { CalendarComponent } from '../share/calendar/calendar.component';
import { HistoriqueComponent } from '../share/historique/historique.component';
import { InterventionHistoriqueComponent } from '../share/intervention-historique/intervention-historique.component';

export const ChefServiceRoutes: Routes = [

  { path: 'dashboard', component: DashboardComponent },
  { path: 'reclamation', component: ReclamationComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'intervention', component: InterventionComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'gestion-service',component: GestionServiceComponent },
  { path: 'gestion-service/all-techniciens',component: AllTechniciensComponent },
  { path: 'gestion-service/all-equipes',component: AllEquipesComponent },
  { path: 'calendrier', component: CalendarComponent },
  { path: 'intervention-historique', component: InterventionHistoriqueComponent},

  { path: '', redirectTo: 'services', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(ChefServiceRoutes)],
  exports: [RouterModule]
})
export class ChefServiceRoutingModule { }

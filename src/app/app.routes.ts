// app.routes.ts
import { Routes } from '@angular/router';

import { DashboardComponent } from './agent/dashboard/dashboard.component';
import { ReclamationComponent } from './agent/reclamation/reclamation.component';
import { ServicesComponent } from './agent/services/services.component';

export const routes: Routes = [

              /*****      AGENT ROUTES    *****/
  { path: 'agent/dashboard', component: DashboardComponent },
  { path: 'agent/reclamation', component: ReclamationComponent },
  { path: 'agent/services', component: ServicesComponent },

];

// app.routes.ts
import { Routes } from '@angular/router';
import { AgentRoutes } from './agent/agent.routes';
import { ChefDepartementRoutes } from './chefDepartement/chefDepartement.routes';
import { ChefServiceRoutes } from './chefService/chef-service-routing.module'


export const routes: Routes = [
  { path: 'agent', children: AgentRoutes },
  { path: 'chefDepartement', children: ChefDepartementRoutes },
  { path: 'chefService', children: ChefServiceRoutes },

  { path: '', redirectTo: '/chefService', pathMatch: 'full' } // Redirection par défaut vers /agent
];

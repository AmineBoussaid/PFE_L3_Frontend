// app.routes.ts
import { Routes } from '@angular/router';
import { AgentRoutes } from './agent/agent.routes';
import { ChefDepartementRoutes } from './chefDepartement/chefDepartement.routes';
import { ChefServiceRoutes } from './chefService/chef-service.routes'
import { TechnicienRoutes } from './technicien/technicien.routes';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'agent', children: AgentRoutes },
  { path: 'chefDepartement', children: ChefDepartementRoutes },
  { path: 'chefService', children: ChefServiceRoutes },
  { path: 'technicien', children: TechnicienRoutes },

  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirection par défaut vers /agent
];

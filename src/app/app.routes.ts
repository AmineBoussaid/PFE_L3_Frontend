// app.routes.ts
import { Routes } from '@angular/router';
import { AgentRoutes } from './agent/agent.routes';
import { ChefDepartementRoutes } from './chefDepartement/chefDepartement.routes';
import { ChefServiceRoutes } from './chefService/chef-service.routes'
import { TechnicienRoutes } from './technicien/technicien.routes';
import { LoginComponent } from './share/login/login.component';
import { AuthGuard, ProfileGuard } from './app.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ProfileGuard] },
  { path: 'agent', children: AgentRoutes, canActivate: [AuthGuard]  },
  { path: 'chefDepartement', children: ChefDepartementRoutes, canActivate: [AuthGuard] },
  { path: 'chefService', children: ChefServiceRoutes, canActivate: [AuthGuard] },
  { path: 'technicien', children: TechnicienRoutes, canActivate: [AuthGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

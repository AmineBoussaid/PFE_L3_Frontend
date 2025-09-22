// app.routes.ts
import { Routes } from '@angular/router';
import { AgentRoutes } from './agent/agent.routes';
import { ChefDepartementRoutes } from './chefDepartement/chefDepartement.routes';
import { ChefServiceRoutes } from './chefService/chef-service.routes'
import { TechnicienRoutes } from './technicien/technicien.routes';
import { LoginComponent } from './share/login/login.component';
import { AuthGuard, ProfileGuard, RoutGuard } from './app.guard';
import { Error404Component } from './share/error404/error404.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ProfileGuard] },
  { path: 'agent', children: AgentRoutes, canActivate: [AuthGuard,RoutGuard]  },
  { path: 'chefDepartement', children: ChefDepartementRoutes, canActivate: [AuthGuard,RoutGuard] },
  { path: 'chefService', children: ChefServiceRoutes, canActivate: [AuthGuard,RoutGuard] },
  { path: 'technicien', children: TechnicienRoutes, canActivate: [AuthGuard,RoutGuard] },
  { path: 'unauthorized', component: Error404Component },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

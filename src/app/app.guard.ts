import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";


export const AuthGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if(!auth.isLogged()) {
        router.navigateByUrl('/login')
        return false
    }
    return true
}

export const ProfileGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if(auth.isLogged()) {
    let uri = '';
    switch(auth.getCurrentUser()?.role){
      case 'agent' : uri = 'agent' ; break;
      case 'chef service' : uri = 'chefService' ; break;
      case 'chef departement' : uri = 'chefDepartement' ; break;
      case 'technicien' : uri = 'technicien' ; break;
    }
    auth.getCurrentUser()?.role
    router.navigateByUrl(`/${uri}`);
    return false;
  }
return true;
}

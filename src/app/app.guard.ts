import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { HttpClient } from "@angular/common/http";


export const AuthGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if(!auth.isLogged()) {
        router.navigateByUrl('/login')
        return false
    }
    return true
}


export const RoutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Vérifiez si l'utilisateur est authentifié
  if (auth.isLogged()) {
    // Obtenez la route actuelle
    const currentUrl = state.url;

    // Vérifiez si la route est autorisée pour le rôle de l'utilisateur via une requête API
    return VerifiedRoute(currentUrl).then((isAuthorized) => {
      if (isAuthorized) {
        return true; // La route est autorisée
      } else {
        router.navigate(['/unauthorized']); // Rediriger si non autorisé
        return false;
      }
    });
  }
  router.navigate(['/login']);
  return false;
}



export const VerifiedRoute = (route: string): Promise<boolean> => {

  const http = inject(HttpClient); // Injecte le HttpClient pour faire des requêtes HTTP
  const apiUrl = 'http://localhost:8080/api/role_routes/check-authorization'; // Remplacer par l'URL de votre API

  return http.get<boolean>(`${apiUrl}?route=${encodeURIComponent(route)}`)
    .toPromise()
    .then((response) => {
      // Assurer que la réponse est un boolean, sinon retourner false
      return typeof response === 'boolean' ? response : false;
    })
    .catch((error) => {
      console.error('Erreur lors de la vérification de l\'autorisation de la route', error);
      return false; // Si une erreur se produit, refuser l'accès
    });
};


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

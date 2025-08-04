import { User } from "./models";

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('currentUser');
  console.log(userJson)
  if (userJson) {
    try {
      // Parse le JSON et retourne l'objet User
      const user: User = JSON.parse(userJson);
      console.log(user)
      return user;

    } catch (error) {
      // Log de l'erreur pour le débogage
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  return null;
}

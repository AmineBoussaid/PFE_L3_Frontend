import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private key : string = "currentUser";

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/login/${email}/${password}`).pipe(
      map(user => {
        if (user) {
          // Stocker les informations utilisateur (ex: localStorage ou sessionStorage)
          localStorage.setItem(this.key, JSON.stringify(user));
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.key);
    //this.router.navigate(['/login']);


  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.key);
    return userJson ? JSON.parse(userJson) : null;
  }

  isLogged(): boolean {
      return !!this.getCurrentUser();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { UserDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey : string = "currentUser";
  private tokenKey : string = "token";

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  auth(username: string, password: string): Observable<UserDto> {
    return this.http.post<string>(`http://localhost:8080/api/auth/login`, { username, password })
    .pipe(
      map((jwt: any) => {
        console.log(jwt);
        if (jwt) {
          // Stocker le token JWT
          localStorage.setItem(this.tokenKey, jwt['access_token']);
          return jwt;
        }
        return null;
      }),
      switchMap((jwt) =>
        this.http.get<UserDto>(`${this.apiUrl}/getByUsername/${username}`).pipe(
          map(user => {
            if (user) {
              // Stocker les informations utilisateur
              localStorage.setItem(this.userKey, JSON.stringify(user));
            }
            return user;
          })
        )
      )
    );
  }



  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    //this.router.navigate(['/login']);


  }

  getCurrentUser(): UserDto | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  isLogged(): boolean {
      return !!this.getCurrentUser();
  }


  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}

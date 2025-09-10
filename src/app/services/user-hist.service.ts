import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserHistoriqueDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHistService {
  private apiUrl = 'http://localhost:8080/api/users-historique';

  constructor(private http: HttpClient) { }

  getUserHist(): Observable<UserHistoriqueDto[]> {
    return this.http.get<UserHistoriqueDto[]>(`${this.apiUrl}/getAll`);
  }

  getByUserHistId(): Observable<UserHistoriqueDto[]> {
    return this.http.get<UserHistoriqueDto[]>(`${this.apiUrl}/getByUserId`);
  }
}

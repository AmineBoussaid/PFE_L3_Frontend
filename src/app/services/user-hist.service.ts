import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserHist } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHistService {
  private apiUrl = 'http://localhost:8080/api/users-historique';

  constructor(private http: HttpClient) { }

  getUserHist(): Observable<UserHist[]> {
    return this.http.get<UserHist[]>(`${this.apiUrl}/getAll`);
  }

  getByUserHistId(userId:number): Observable<UserHist[]> {
    return this.http.get<UserHist[]>(`${this.apiUrl}/getByUserId/${userId}`);
  }
}

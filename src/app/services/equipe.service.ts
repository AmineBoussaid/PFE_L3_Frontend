import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipe } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private apiUrl = 'http://localhost:8080/api/equipes';

  constructor(private http: HttpClient) { }

  addEquipe(equipe: Equipe): Observable<Equipe> {
    return this.http.post<Equipe>(`${this.apiUrl}/add`, equipe);
  }

  getEquipe(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${this.apiUrl}/getAll`);
  }

}

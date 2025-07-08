import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../../models';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReclamationService {
  private apiUrl = 'http://localhost:8080/api/reclamations';

  constructor(private http: HttpClient) { }

  addReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/add`, reclamation);
  }

  getReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getAll`);
  }


  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  getReclamationByFonctionnel(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }


}

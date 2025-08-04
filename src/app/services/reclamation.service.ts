import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../models';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReclamationService {
  private apiUrl = 'http://localhost:8080/api/reclamations';

  constructor(private http: HttpClient) { }

  addReclamation(reclamation: Reclamation, userId: number): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/add/${userId}`, reclamation);
  }

  updateReclamation(reclamation: Reclamation, userId: number): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/update/${userId}`, reclamation);
  }

  deleteById(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}/${userId}`);
  }


  getReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getAll`);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/getById/${id}`);
  }

  getReclamationByIdFonctionnel(idFonctionnel: string): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/getByIdFonctionnel/${idFonctionnel}`);
  }

  getReclamationByAgentId(agent_id: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getByAgentId/${agent_id}`);
  }

  getReclamationsByServiceId(servive_id : number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getByServiceId/${servive_id}`);
  }

  getReclamationsByDepartementId(departement_id : number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

}

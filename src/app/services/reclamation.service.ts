import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReclamationDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReclamationService {
  private apiUrl = 'http://localhost:8080/api/reclamations';

  constructor(private http: HttpClient) { }

  addReclamation(reclamation: ReclamationDto): Observable<ReclamationDto> {
    return this.http.post<ReclamationDto>(`${this.apiUrl}/add`, reclamation);
  }

  updateReclamation(reclamation: ReclamationDto): Observable<ReclamationDto> {
    return this.http.put<ReclamationDto>(`${this.apiUrl}/update`, reclamation);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}`);
  }


  getReclamations(): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getAll`);
  }

  getReclamationById(id: number): Observable<ReclamationDto> {
    return this.http.get<ReclamationDto>(`${this.apiUrl}/getById/${id}`);
  }

  getReclamationByIdFonctionnel(idFonctionnel: string): Observable<ReclamationDto> {
    return this.http.get<ReclamationDto>(`${this.apiUrl}/getByIdFonctionnel/${idFonctionnel}`);
  }

  getReclamationByAgentId(agent_id: number): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getByAgentId/${agent_id}`);
  }

  getReclamationsByServiceId(servive_id : number): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getByServiceId/${servive_id}`);
  }

  getReclamationsByDepartementId(departement_id : number): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

}

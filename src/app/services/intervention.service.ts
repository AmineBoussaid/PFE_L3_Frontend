import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterventionDto, InterventionHistoriqueDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';
  private apiUrl_2 = 'http://localhost:8080/api/interventions-historique';

  constructor(private http: HttpClient) { }

  addIntervention(interventionDTO: InterventionDto, userId: number): Observable<InterventionDto> {
    return this.http.post<InterventionDto>(`${this.apiUrl}/add/${userId}`, interventionDTO);
  }


  deleteById(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}/${userId}`);
  }

  updateIntervention(interventionDTO: InterventionDto, userId: number): Observable<InterventionDto> {
    return this.http.put<InterventionDto>(`${this.apiUrl}/update/${userId}`, interventionDTO);
  }

  getInterventions(): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(`${this.apiUrl}/getAll`);
  }

  getInterventionById(id: number): Observable<InterventionDto> {
    return this.http.get<InterventionDto>(`${this.apiUrl}/getById/${id}`);
  }

  getInterventionsByServiceId(service_id: number): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(`${this.apiUrl}/getByServiceId/${service_id}`);
  }

  getInterventionsByDepartementId(departement_id: number): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

  getInterventionsByTechnicienId(technicien_id: number): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(`${this.apiUrl}/getByChefOrTechnicien/${technicien_id}`);
  }

  getInterventionsByIdFonctionnel(idFonctionnel: string): Observable<InterventionDto> {
    return this.http.get<InterventionDto>(`${this.apiUrl}/getByIdFonctionnel/${idFonctionnel}`);
  }

  getInterventionsByCreateurId(createurId: number): Observable<InterventionDto[]> {
    return this.http.get<InterventionDto[]>(`${this.apiUrl}/getByCreateurId/${createurId}`);
  }

  getHistoriqueByInterventionId(interventionId: number): Observable<InterventionHistoriqueDto[]> {
    return this.http.get<InterventionHistoriqueDto[]>(`${this.apiUrl_2}/getByIntervention/${interventionId}`);
  }

}

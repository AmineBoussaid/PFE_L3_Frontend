import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Intervention, InterventionDTO } from '../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) { }

  addIntervention(intervention: InterventionDTO, userId: number): Observable<InterventionDTO> {
    return this.http.post<InterventionDTO>(`${this.apiUrl}/add/${userId}`, intervention);
  }


  deleteById(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}/${userId}`);
  }

  updateIntervention(intervention: Intervention, userId: number): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/update/${userId}`, intervention);
  }

  getInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getAll`);
  }

  getInterventionById(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/getById/${id}`);
  }

  getInterventionsByServiceId(service_id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByServiceId/${service_id}`);
  }

  getInterventionsByDepartementId(departement_id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

  getInterventionsByTechnicienId(technicien_id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByTechnicienId/${technicien_id}`);
  }

  getInterventionsByIdFonctionnel(idFonctionnel: string): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/getByIdFonctionnel/${idFonctionnel}`);
  }

  getInterventionsByCreateurId(createurId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByCreateurId/${createurId}`);
  }

}

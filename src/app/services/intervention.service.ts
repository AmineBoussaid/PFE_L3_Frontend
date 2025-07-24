import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Intervention } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) { }

  addIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/add`, intervention);
  }

  getInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getAll`);
  }

  getInterventionsByServiceId(service_id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByServiceId/${service_id}`);
  }

  getInterventionsByDepartementId(departement_id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RapportDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  private apiUrl = 'http://localhost:8080/api/rapports';

  constructor(private http: HttpClient) { }

  addRapport(rapportDto: RapportDto, userId: number): Observable<RapportDto> {
    return this.http.post<RapportDto>(`${this.apiUrl}/add/${userId}`, rapportDto);
  }

  getByInterventionId(interventionId: number): Observable<RapportDto> {
    return this.http.get<RapportDto>(`${this.apiUrl}/getByInterventionId/${interventionId}`);
  }
}

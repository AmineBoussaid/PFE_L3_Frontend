import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartementDto } from '../models';

@Injectable({ providedIn: 'root'})
export class DepartementService {
  private apiUrl = 'http://localhost:8080/api/departements';

  constructor(private http: HttpClient) { }

  addDepartement(departement: DepartementDto): Observable<DepartementDto> {
    return this.http.post<DepartementDto>(`${this.apiUrl}/add`, departement);
  }

  getDepartements(): Observable<DepartementDto[]> {
    return this.http.get<DepartementDto[]>(`${this.apiUrl}/getAll`);
  }

  getByChefDepartement(chef_departement_id: number): Observable<DepartementDto> {
    return this.http.get<DepartementDto>(`${this.apiUrl}/getByChefDepartement/${chef_departement_id}`);
  }

}

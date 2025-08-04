import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../models';

@Injectable({ providedIn: 'root'})
export class DepartementService {
  private apiUrl = 'http://localhost:8080/api/departements';

  constructor(private http: HttpClient) { }

  addDepartement(departement: Departement): Observable<Departement> {
    return this.http.post<Departement>(`${this.apiUrl}/add`, departement);
  }

  getDepartements(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.apiUrl}/getAll`);
  }

  getByChefDepartement(chef_departement_id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getByChefDepartement/${chef_departement_id}`);
  }

}

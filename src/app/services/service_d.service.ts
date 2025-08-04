import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDService {
  private apiUrl = 'http://localhost:8080/api/services';

  constructor(private http: HttpClient) { }

  addService(service: Service): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/add`, service);
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/getAll`);
  }

  getServicesById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}getById/${id}`);
  }

  getServicesByDepartementId(departement_id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

  getServicesByChefService(chef_service_id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getByChefService/${chef_service_id}`);
  }

}

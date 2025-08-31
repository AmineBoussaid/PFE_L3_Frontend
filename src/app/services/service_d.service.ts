import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDService {
  private apiUrl = 'http://localhost:8080/api/services';


  constructor(private http: HttpClient) { }

  addService(service: ServiceDto): Observable<ServiceDto> {
    return this.http.post<ServiceDto>(`${this.apiUrl}/add`, service);
  }

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.apiUrl}/getAll`);
  }

  getServicesById(id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}getById/${id}`);
  }

  getServicesByDepartementId(departement_id: number): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(`${this.apiUrl}/getByDepartementId/${departement_id}`);
  }

  getServicesByChefService(chef_service_id: number): Observable<ServiceDto> {
    return this.http.get<ServiceDto>(`${this.apiUrl}/getByChefService/${chef_service_id}`);
  }

}

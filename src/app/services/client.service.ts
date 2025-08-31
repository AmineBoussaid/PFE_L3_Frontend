import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/api/clients';
  constructor(private http: HttpClient) { }

  getClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${this.apiUrl}/getAll`);
  }

  getByCodeAbonnement(codeAbonnement: string): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.apiUrl}/getByCodeAbonnement/${codeAbonnement}`);
  }
}

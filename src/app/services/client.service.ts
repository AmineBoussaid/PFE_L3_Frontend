import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/api/clients';
  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/getAll`);
  }

  getByCodeAbonnement(codeAbonnement: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/getByCodeAbonnement/${codeAbonnement}`);
  }
}

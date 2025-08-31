import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EquipeDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private apiUrl = 'http://localhost:8080/api/equipes';
  private apiUrl_ = 'http://localhost:8080/api/technicien-equipes';
  constructor(private http: HttpClient) { }

  addEquipe(equipe: EquipeDto): Observable<EquipeDto> {
    return this.http.post<EquipeDto>(`${this.apiUrl}/add`, equipe);
  }

  getEquipe(): Observable<EquipeDto[]> {
    return this.http.get<EquipeDto[]>(`${this.apiUrl}/getAll`);
  }

  deleteById(id : number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteById/${id}`);
  }

  deleteByEquipeId(equipeId : number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl_}/deleteByEquipeId/${equipeId}`);
  }

  getEquipeByService(serivceId:number):Observable<EquipeDto[]> {
    return this.http.get<EquipeDto[]>(`${this.apiUrl}/getBySerice/${serivceId}`);
  }

}

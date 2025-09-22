import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TechnicienDto, UserDto } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private apiUrl_2 = 'http://localhost:8080/api/techniciens';

  constructor(private http: HttpClient) { }

  addService(user: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/add`, UserDto);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/getAll`);
  }

  getById(id : number): Observable<UserDto>{
    return this.http.get<UserDto>(`${this.apiUrl}/getById/${id}`);
  }

  getTechniciensByServiceId(serviceId: number): Observable<TechnicienDto[]> {
    return this.http.get<TechnicienDto[]>(`${this.apiUrl_2}/getByServiceId/${serviceId}`);
  }

  getTechniciensById(id:number): Observable<TechnicienDto> {
    return this.http.get<TechnicienDto>(`${this.apiUrl_2}/getById/${id}`);

  }
}

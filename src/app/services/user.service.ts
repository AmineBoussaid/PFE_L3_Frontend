import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TechnicienDto, User } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  addService(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, User);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAll`);
  }

  getTechniciensByServiceId(serviceId: number): Observable<TechnicienDto[]> {
    return this.http.get<TechnicienDto[]>(`${this.apiUrl}/getTechniciensByServiceId/${serviceId}`);
  }
}

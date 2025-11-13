import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../models/userdto.model';
import { AddUser } from '../models/add-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiBaseUrl}/api/user/users`);
  }

  addUser(model: AddUser): Observable<void> {
    return this.http.post<void>(
      `${environment.apiBaseUrl}/api/user/add?addAuth=true`,model
    );
  }
}

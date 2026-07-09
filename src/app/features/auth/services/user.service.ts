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
      `${environment.apiBaseUrl}/api/user/add?addAuth=true`, model
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/user/delete/${id}?addAuth=true`);
  }

  getUserRoles(userIdOrEmail: string): Observable<{ id: string; email: string; roles: string[] }> {
    return this.http.get<{ id: string; email: string; roles: string[] }>(
      `${environment.apiBaseUrl}/api/roles/user/${encodeURIComponent(userIdOrEmail)}?addAuth=true`
    );
  }

  getAllRoles(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(
      `${environment.apiBaseUrl}/api/roles?addAuth=true`
    );
  }

  assignRole(userIdOrEmail: string, roleName: string): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/roles/assign?addAuth=true`,
      { userIdOrEmail, roleName }
    );
  }

  removeRole(userIdOrEmail: string, roleName: string): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/roles/remove?addAuth=true`,
      { userIdOrEmail, roleName }
    );
  }
}

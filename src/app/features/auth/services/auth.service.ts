import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) {
    // Hydrate in-memory user state after refresh/navigation
    const existing = this.getUser();
    if (existing) {
      this.$user.next(existing);
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    // Login must be unauthenticated; do not include addAuth=true here.
    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}/api/auth/login`,
      {
        email: request.email,
        password: request.password,
      }
    );
  }

  /**
   * Call this once after a successful login response.
   * - Persists JWT in cookie as: Authorization=Bearer <token>
   * - Persists user metadata in localStorage
   */
  setSession(response: LoginResponse): void {
    const bearer = response.token?.startsWith('Bearer ')
      ? response.token
      : `Bearer ${response.token}`;

    // Store token for interceptor/guard
    this.cookieService.set('Authorization', bearer, undefined, '/');

    // Persist user
    this.setUser({
      email: response.email,
      roles: response.roles,
      userId: response.userId,
    });
  }

  getToken(): string {
    return this.cookieService.get('Authorization');
  }

  setUser(user: User): void {
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
    localStorage.setItem('user-id', user.userId);
  }
  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');
    const userId = localStorage.getItem('user-id');

    if (email && roles && userId) {
      const user: User = {
        userId: userId,
        email: email,
        roles: roles.split(','),
      };

      return user;
    }

    return undefined;
  }

  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}

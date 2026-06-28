import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RefreshResponse } from '../models/refresh-response.model';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}/api/auth/login`,
      {
        email: request.email,
        password: request.password,
      }
    );
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http
      .post<RefreshResponse>(
        `${environment.apiBaseUrl}/api/auth/refresh`,
        { refreshToken: this.getRefreshToken() }
      )
      .pipe(
        tap((response) => {
          this.storeTokens(response.accessToken, response.refreshToken);
        })
      );
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
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http
        .post(`${environment.apiBaseUrl}/api/auth/revoke`, { refreshToken })
        .subscribe({
          next: () => this.clearStorage(),
          error: () => this.clearStorage(),
        });
    } else {
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}

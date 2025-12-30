import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function shouldInterceptRequest(request: HttpRequest<any>): boolean {
  return request.urlWithParams.indexOf('addAuth=true', 0) > -1;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);

  let requestToSend = req;

  if (shouldInterceptRequest(req)) {
    const authHeader = cookieService.get('Authorization');
    requestToSend = authHeader
      ? req.clone({ setHeaders: { Authorization: authHeader } })
      : req;
  }

  return next(requestToSend).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

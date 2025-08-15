import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  const authHeader = cookieService.get('Authorization');
  const authRequest = authHeader
    ? req.clone({ setHeaders: { Authorization: authHeader } })
    : req;
  return next(authRequest);
};

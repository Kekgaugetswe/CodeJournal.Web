import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

function shouldInterceptRequest(request: HttpRequest<any>): boolean{
  return request.urlWithParams.indexOf('addAuth=true', 0) > -1? true: false;

}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  if(shouldInterceptRequest(req)) {

    const authHeader = cookieService.get('Authorization');
    const authRequest = authHeader
      ? req.clone({ setHeaders: { Authorization: authHeader } })
      : req;
    return next(authRequest);
  }

  return next(req)
};


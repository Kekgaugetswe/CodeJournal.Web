import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

const RETRIED_HEADER = 'X-Retried-Request';

function shouldInterceptRequest(request: HttpRequest<any>): boolean {
  return request.urlWithParams.includes('addAuth=true');
}

function addAuthHeader(
  request: HttpRequest<any>,
  token: string
): HttpRequest<any> {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let requestToSend = req;

  if (shouldInterceptRequest(req)) {
    const token = authService.getAccessToken();
    if (token) {
      requestToSend = addAuthHeader(req, token);
    }
  }

  return next(requestToSend).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        shouldInterceptRequest(req)
      ) {
        // If this request was already retried, do not attempt refresh again
        if (req.headers.has(RETRIED_HEADER)) {
          return throwError(() => error);
        }

        return handleUnauthorizedError(req, next, authService, router);
      }

      return throwError(() => error);
    })
  );
};

function handleUnauthorizedError(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
) {
  if (isRefreshing) {
    // Refresh is already in progress — queue this request
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            [RETRIED_HEADER]: 'true',
          },
        });
        return next(retryReq);
      })
    );
  }

  // Not currently refreshing — initiate refresh
  isRefreshing = true;
  refreshTokenSubject.next(null);

  return authService.refreshToken().pipe(
    switchMap((response) => {
      isRefreshing = false;
      refreshTokenSubject.next(response.accessToken);

      // Retry the original request with the new token, marked as retried
      const retryReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${response.accessToken}`,
          [RETRIED_HEADER]: 'true',
        },
      });
      return next(retryReq);
    }),
    catchError((refreshError) => {
      isRefreshing = false;
      refreshTokenSubject.next(null);

      authService.logout();
      const currentUrl = router.url;
      router.navigate(['/login'], {
        queryParams: { returnUrl: currentUrl },
      });

      return throwError(() => refreshError);
    })
  );
}

import { CookieService } from 'ngx-cookie-service';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

// Helper: normalize "Bearer <token>" or raw token
function normalizeJwt(raw: string): string {
  const token = (raw ?? '').trim();
  if (!token) return '';
  return token.toLowerCase().startsWith('bearer ')
    ? token.slice('bearer '.length).trim()
    : token;
}

// Helper: extract roles from common claim shapes
function extractRoles(decoded: any): string[] {
  if (!decoded) return [];

  // common custom claim shapes
  const directRoles = decoded.roles ?? decoded.Roles;
  if (Array.isArray(directRoles)) return directRoles.map(String);
  if (typeof directRoles === 'string' && directRoles.length) return directRoles.split(',').map(s => s.trim()).filter(Boolean);

  // ASP.NET Identity/JWT common role claim keys
  const roleClaimKeys = [
    'role',
    'Role',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  ];

  for (const key of roleClaimKeys) {
    const val = decoded[key];
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === 'string' && val.length) return [val];
  }

  return [];
}

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Read token from cookie (set by AuthService.setSession)
  const raw = cookieService.get('Authorization');
  const jwt = normalizeJwt(raw);

  if (!jwt) {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { return: state.url },
    });
  }

  let decoded: any;
  try {
    decoded = jwtDecode(jwt);
  } catch {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { return: state.url },
    });
  }

  // Expiry check
  const expSeconds = decoded?.exp;
  const expMs = typeof expSeconds === 'number' ? expSeconds * 1000 : 0;
  if (!expMs || expMs < Date.now()) {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { return: state.url },
    });
  }

  // Required role can be set per-route: data: { roles: ['Writer'] }
  const requiredRoles: string[] = (route.data?.['roles'] as string[]) ?? ['Writer'];
  const tokenRoles = extractRoles(decoded);

  // Keep local user in sync (optional, but avoids "Current user: undefined" on refresh)
  const existingUser = authService.getUser();
  if (!existingUser) {
    const email = decoded?.email ?? decoded?.Email ?? decoded?.unique_name ?? decoded?.sub;
    const userId = decoded?.userId ?? decoded?.UserId ?? decoded?.nameid ?? decoded?.sub;

    if (email && userId) {
      authService.setUser({
        email: String(email),
        userId: String(userId),
        roles: tokenRoles,
      });
    }
  }

  const isAllowed = requiredRoles.length === 0 || requiredRoles.some(r => tokenRoles.includes(r));
  if (isAllowed) return true;

  // Not allowed → redirect somewhere safe
  return router.createUrlTree(['/login'], {
    queryParams: { return: state.url },
  });
};

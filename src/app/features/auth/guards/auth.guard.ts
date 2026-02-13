import { CookieService } from 'ngx-cookie-service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  //check for the JWT token

  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser()
  let token = cookieService.get('Authorization');
  if (token && user) {
    token = token.replace(/^Bearer\s+/i, '');
    const decodedToken: any = jwtDecode(token);

    const experiationDate = (decodedToken.exp * 1000);

    const currentTime = new Date().getTime();
    if (experiationDate < currentTime) {
      authService.logout();
      return router.createUrlTree(['/login'], {
        queryParams: { return: state.url },
      });
    }else {
        if(user.roles.includes('Writer')){
          return true;
        }else{
          alert('Aunthorized');
          return false;
        }
    }
  } else {
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { return: state.url },
    });
  }
};

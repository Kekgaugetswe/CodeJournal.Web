import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Router} from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: LoginRequest;
  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router) {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {


    console.log(this.model);

    this.authService.login(this.model).subscribe({
      next: (response) =>{
        console.log('Login successful', response);
        // Set Auth cookie
        // NOTE: On the VM you are serving over HTTP, so `secure` MUST be false or the cookie won't be stored/sent.
        // When you later move to HTTPS, switch `secure` to true and consider `SameSite=None` if needed.
        this.cookieService.set(
          'Authorization',
          `Bearer ${response.token}`,
          undefined,
          '/',
          undefined,
          false,
          'Lax'
        );

        // Set user
        this.authService.setUser({
          email: response.email,
          roles: response.roles,
          userId: response.userId
        });

        // redirect back to the home page
        this.router.navigate(['/']);
      },

    });
  }

}

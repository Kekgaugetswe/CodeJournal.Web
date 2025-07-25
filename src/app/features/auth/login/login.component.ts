import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Router, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
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
        //Set Auth cookie
        this.cookieService.set('Authorization', `Bearer ${response.token}`, undefined, '/', undefined, true, 'Strict');

        // Set user
        this.authService.setUser({
          email: response.email,
          roles: response.roles,
        });

        // redirect back to the home page
        this.router.navigate(['/']);
      },

    });
  }

}

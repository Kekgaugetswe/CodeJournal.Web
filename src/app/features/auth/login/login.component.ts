import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: LoginRequest;
  constructor(private authService: AuthService, private cookieService: CookieService) {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {


    console.log(this.model);

    this.authService.login(this.model).subscribe({
      next: (response) =>{
        console.log('Login successful', response);
        //Set Auth cookie
        this.cookieService.set('Authorization', `Bearer ${response.token}`, undefined, '/', undefined, true, 'Strict');
      },

    });
  }

}

import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: LoginRequest;
  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        // Store tokens in localStorage
        this.authService.storeTokens(response.token, response.refreshToken);

        // Set user
        this.authService.setUser({
          email: response.email,
          roles: response.roles,
          userId: response.userId,
        });

        // Redirect back to the home page
        this.router.navigate(['/']);
      },
    });
  }
}

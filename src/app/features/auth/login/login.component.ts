import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: LoginRequest;
  errorMessage = '';
  loading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.model).subscribe({
      next: (response) => {
        this.loading = false;

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
      error: (err) => {
        this.loading = false;

        if (err.error?.errors) {
          // ASP.NET ValidationProblem format
          const errors = err.error.errors;
          const messages: string[] = [];
          for (const key of Object.keys(errors)) {
            messages.push(...errors[key]);
          }
          this.errorMessage = messages.join(' ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
    });
  }
}

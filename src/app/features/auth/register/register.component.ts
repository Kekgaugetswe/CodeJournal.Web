import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  model = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.model.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.model.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;

    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage =
          res.message || 'Registration successful. Please check your email to verify your account.';
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.errors) {
          const errors = err.error.errors;
          const messages: string[] = [];
          for (const key of Object.keys(errors)) {
            messages.push(...errors[key]);
          }
          this.errorMessage = messages.join(' ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}

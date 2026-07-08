import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  submitted = false;
  message = '';

  constructor(private readonly authService: AuthService) {}

  onSubmit(): void {
    if (!this.email.trim()) return;

    this.loading = true;
    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: (res) => {
        this.loading = false;
        this.submitted = true;
        this.message = res.message;
      },
      error: () => {
        this.loading = false;
        this.submitted = true;
        this.message =
          'If an account with that email exists, a password reset link has been sent.';
      },
    });
  }
}

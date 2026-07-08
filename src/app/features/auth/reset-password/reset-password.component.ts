import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  state: 'form' | 'success' | 'invalid' = 'form';
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.email || !this.token) {
      this.state = 'invalid';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;

    this.authService
      .resetPassword(this.email, this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.loading = false;
          this.state = 'success';
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
            this.errorMessage = 'Password reset failed. The link may have expired.';
          }
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent implements OnInit {
  state: 'loading' | 'success' | 'error' | 'invalid' | 'resend' = 'loading';
  errorMessage = '';
  resendEmail = '';
  resendMessage = '';
  resendLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.getUser()) {
      this.router.navigate(['/']);
      return;
    }

    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.state = 'invalid';
      return;
    }

    this.resendEmail = email;

    this.authService.confirmEmail(email, token).subscribe({
      next: () => {
        this.state = 'success';
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage =
          err.error?.message || 'Email confirmation failed. The link may have expired.';
      },
    });
  }

  showResendForm(): void {
    this.state = 'resend';
  }

  onResendSubmit(): void {
    if (!this.resendEmail.trim()) return;

    this.resendLoading = true;
    this.resendMessage = '';

    this.authService.resendConfirmationEmail(this.resendEmail.trim()).subscribe({
      next: (res) => {
        this.resendMessage = res.message;
        this.resendLoading = false;
      },
      error: () => {
        this.resendMessage =
          'If an account with that email exists, a verification email has been sent.';
        this.resendLoading = false;
      },
    });
  }
}

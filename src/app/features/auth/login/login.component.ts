import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;
  constructor(private authService: AuthService) {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {


    console.log(this.model);

    this.authService.login(this.model).subscribe({
      next: (response) =>{
        console.log('Login successful', response);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

}

import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;
  constructor() {
    this.model = { email: '', password: '' };
  }

  onFormSubmit(): void {
    console.log(this.model);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = { username: '', password: '' };

  constructor(private http: HttpClient) {}

  login() {
      this.http.post('http://localhost:8000/login/', this.user)
        .subscribe(
            response => console.log('Login successful', response),
            error => console.error('Login failed', error)
        );
  }
}

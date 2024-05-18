import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input'
import { MatCard, MatCardContent } from '@angular/material/card'
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, MatInputModule, MatCardContent, MatCard, MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.adminService.login(username, password).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          this.router.navigate(['/admin/myhome'], { replaceUrl: true });
        },
        error: (error) => {
          this.errorMessage = 'Invalid credentials';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields.';
    }
  }

  // helper method for access to the form controls directly from the template
  get f() { return this.form.controls; }
}

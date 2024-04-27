import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/admin/'

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}login/`, {username, password});
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    this.http.post<any>(`${this.apiUrl}logout/`, {}, { headers }).subscribe({
      next: (response) => {
        localStorage.removeItem('token');
        this.router.navigate(['/admin/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }

}

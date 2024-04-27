import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  getHyperlinks(section: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${section}/`);
  }

  // cnchome
  getCncHomeText(part: string): Observable<any> {
    return this.http.get(`${this.apiUrl}cnchometext/${part}/`);
  }

  updateCncHomeText(part: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}cnchometext/${part}/`, { text });
  }

  // bibtexchars
  getBibtexChars(): Observable<any> {
    return this.http.get(`${this.apiUrl}bibtexchars/`);
  }

  addBibtexChar(charData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}bibtexchars/`, charData);
  }

  updateBibtexChar(id: number, charData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}bibtexchars/${id}/`, charData);
  }

  deleteBibtexChar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}bibtexchars/${id}/`);
  }

  // cogscihome
  getCogSciText(part: string): Observable<any> {
    return this.http.get(`${this.apiUrl}cogscitext/${part}/`);
  }

  updateCogSciText(part: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}cogscitext/${part}/`, { text });
  }

  // aiseminar
  getAiseminarsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}aiseminar/`);
  }

  addAiseminar(aiseminar: any): Observable<any> {
    return this.http.post(`${this.apiUrl}aiseminar/`, aiseminar);
  }

  updateAiseminar(id: number, aiseminar: any): Observable<Object> {
    return this.http.put(`${this.apiUrl}aiseminar/${id}/`, aiseminar);
  }

  deleteAiseminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}aiseminar/${id}/`);
  }

}

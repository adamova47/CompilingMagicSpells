import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.post<any>(`${this.apiUrl}wslogin/`, {username, password});
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    this.http.post<any>(`${this.apiUrl}wslogout/`, {}, { headers }).subscribe({
      next: (response) => {
        localStorage.removeItem('token');
        this.router.navigate(['/admin/login']);
      },
      error: (error) => {
        console.error('Logout failed.', error);
      }
    });
  }

  getHyperlinks(section: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${section}/`);
  }

  // insertdata
  getUserInsertData(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}insertdata/${username}`);
  }

  getPublicationsByProjectsAndUsers(projectIds: number[], userIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}insertdata/`, { project_ids: projectIds, user_ids: userIds });
  }

  // myhome
  getMyHomeHyperlinks(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}myhomenavbar/?username=${username}`);
  }

  getMyHomeData(username: string, getname: string): Observable<any> {
    return this.http.get(`${this.apiUrl}myhomedata/?username=${username}&getname=${getname}`);
  }

  updateMyHomeData(username: string, getname: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}myhomedata/?username=${username}&getname=${getname}`, data);
  }

  // cnchome
  getCncHomeText(part: string): Observable<any> {
    return this.http.get(`${this.apiUrl}cnchometext/${part}/`);
  }

  updateCncHomeText(part: string, text: string): Observable<any> {
    return this.http.put(`${this.apiUrl}cnchometext/${part}/`, { text });
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

  updateCogSciText(part: string, text: any): Observable<any> {
    return this.http.put(`${this.apiUrl}cogscitext/${part}/`, { text });
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

  // cnc projects
  getProjectsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}projects/`);
  }

  addProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}projects/`, project);
  }

  updateProject(id: number, project: any): Observable<Object> {
    return this.http.put(`${this.apiUrl}projects/${id}/`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}projects/${id}/`);
  }

  // publications
  getPublicationsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}publications/`);
  }

  addPublication(publication: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}publications/`, publication);
  }

  updatePublication(id: number, publication: any): Observable<Object> {
    return this.http.put(`${this.apiUrl}publications/${id}/`, publication);
  }

  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}publications/${id}/`);
  }

  sendBibtexData(bibtexContent: string): Observable<any> {
    return this.http.post(`${this.apiUrl}bibtexs/`, { bibtexContent });
  }

  getBibTex(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}getBib/${id}/`);
  }

  exportBibtex(userIds: any[], projectIds: any[]): Observable<any> {
    const body = { userIds, projectIds };
    return this.http.post(`${this.apiUrl}exportBibtex/`, body, { responseType: 'blob' });
  }

  // general 
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}userslist/`)
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}projectslist/`)
  }
}

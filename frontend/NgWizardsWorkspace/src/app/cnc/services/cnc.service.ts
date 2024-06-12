import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CncService {
  private apiUrl = 'http://api:8000/cnc/'; // change from localhost to api

  constructor(private http: HttpClient) { }

  getHyperlinkNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}navbar/`);
  }

  getContentsByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${name}/`);
  }

  getFooter(): Observable<any> {
    return this.http.get(`${this.apiUrl}footer/`)
  }

  getBibTex(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}getBib/${id}/`);
  }
}

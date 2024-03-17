import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import url from '../localhost';
import { Subarea } from 'src/app/models/SubArea/subarea.model';

@Injectable({
  providedIn: 'root'
})
export class SubareaService {

  constructor(private http: HttpClient) { }

  // Obtener listado de subarea
  getSubAreas(): Observable<Subarea[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Subarea[]>(`${url}/api/subarea`, { headers });
  }

  // Registrar un nueva subarea
  registrarSubArea(subarea: Subarea): Observable<Subarea> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Subarea>(`${url}/api/subarea`, subarea, { headers });
  }

  // Desactivar un área por su id
  desactivarSubArea(id: number,subarea:Subarea): Observable<Subarea> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Subarea>(`${url}/api/subarea/desactivar/${id}`,subarea, { headers });
  }
  // Obtener area por id
  getById(id: number): Observable<Subarea> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Subarea>(`${url}/api/subarea/${id}`, { headers });
  }
  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}

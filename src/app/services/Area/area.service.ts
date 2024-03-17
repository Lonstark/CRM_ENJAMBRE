import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from 'src/app/models/Area/area.model';
import url from '../localhost';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient) { }

  // Obtener listado de area
  getAreas(): Observable<Area[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Area[]>(`${url}/api/area`, { headers });
  }

  getActiveAreas(): Observable<Area[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Area[]>(`${url}/api/area/listActivos`, { headers });
  }

  // Obtener area por id
  getById(id:number): Observable<Area> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Area>(`${url}/api/area/${id}`, { headers });
  }

  // Registrar un nueva área
  registrarArea(area: Area): Observable<Area> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Area>(`${url}/api/area`, area, { headers });
  }

  // Desactivar un área por su id
  desactivarArea(id: number,area:Area): Observable<Area> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Area>(`${url}/api/area/desactivar/${id}`,area, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

}

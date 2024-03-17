import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ubigeo } from 'src/app/models/Ubigeo/ubigeo.model';
import url from '../localhost';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(private http: HttpClient) { }

  // Obtener los departamentos
  getDepartamentos(): Observable<Ubigeo[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Ubigeo[]>(`${url}/api/ubigeo/departamentos`, { headers });
  }

  // Obtener las provincias por el departamento
  getProvincias(departamento: string): Observable<Ubigeo[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Ubigeo[]>(`${url}/api/ubigeo/provincias/${departamento}`, { headers });
  }

  // Obtener los distritos por la provincia
  getDistritos(provincia: string): Observable<Ubigeo[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Ubigeo[]>(`${url}/api/ubigeo/distritos/${provincia}`, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }



}

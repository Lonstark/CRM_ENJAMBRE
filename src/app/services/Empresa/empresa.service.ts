import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import url from '../localhost';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient) { }

  // Obtener listado de empresas
  getEmpresas(): Observable<Empresa[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Empresa[]>(`${url}/api/empresa`, { headers });
  }

  getActiveEmpresas(): Observable<Empresa[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Empresa[]>(`${url}/api/empresa/listActivos`, { headers });
  }

  // Desactivar una empresa por su id
  desactivarEmpresa(id: number, empresa: Empresa): Observable<Empresa> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Empresa>(`${url}/api/empresa/desactivar/${id}`, empresa, { headers });
  }
  // Registrar un nueva Empresa
  registrarEmpresa(empresa: Empresa): Observable<Empresa> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Empresa>(`${url}/api/empresa`, empresa, { headers });
  }

 // Obtener area por id
 getById(id:number): Observable<Empresa> {
  const token = this.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Empresa>(`${url}/api/empresa/${id}`, { headers });
}

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}

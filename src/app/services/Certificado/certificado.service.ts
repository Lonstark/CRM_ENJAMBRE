import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import url from '../localhost';
import { Certificado } from 'src/app/models/Certificado/certificado.model';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  constructor(private http: HttpClient) { }

  // Obtener listado de area
  getCertificado(): Observable<Certificado[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Certificado[]>(`${url}/api/certificado`, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

   // Registrar un nuevo Certificado
   registrarCertificado(certificado: Certificado): Observable<Certificado> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Certificado>(`${url}/api/certificado`, certificado, { headers });
  }

   // Desactivar un certificado por su id
   desactivarCertificado(id: number,certificado:Certificado): Observable<Certificado> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Certificado>(`${url}/api/certificado/desactivar/${id}`,certificado, { headers });
  }

  getById(id:number): Observable<Certificado> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Certificado>(`${url}/api/certificado/${id}`, { headers });
  }

}
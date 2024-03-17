import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import url from '../localhost';
import { Observable } from 'rxjs';
import { TipoDocumento } from 'src/app/models/TipoDocumento/tipo-documento.model';
@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(private http: HttpClient) { }

  // Obtener tipos de documentos
  getTiposDocumentos(): Observable<TipoDocumento[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TipoDocumento[]>(`${url}/api/documento`, { headers });
  }

  // Registrar un nuevo documento
  registrarTiposDocumentos(nuevoDocumento: TipoDocumento): Observable<TipoDocumento> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<TipoDocumento>(`${url}/api/documento`, nuevoDocumento, { headers });
  }

  // Desactivar un cliente por su id
  desactivarDocumento(id: number, documento: TipoDocumento): Observable<TipoDocumento> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<TipoDocumento>(`${url}/api/documento/desactivar/${id}`, documento, { headers });
  }
  // Obtener area por id
  getById(id: number): Observable<TipoDocumento> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<TipoDocumento>(`${url}/api/documento/${id}`, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

}

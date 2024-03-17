import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import url from '../localhost';
import { Observable, catchError, throwError } from 'rxjs';
import { Perfil } from 'src/app/models/Perfil/perfil.model';
import { PerfilSubMenuAccion } from 'src/app/models/PerfilSubMenuAccion/perfil-sub-menu-accion.model';
import { PerfilRegister } from 'src/app/models/PerfilRegister/perfil-register.model';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private http: HttpClient) { }

  // Obtener listado de perfil
  getPerfiles(): Observable<Perfil[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Perfil[]>(`${url}/api/perfil`, { headers });
  }

  // REGISTRAR
  registerPerfilAndAcciones(perfilRegister: PerfilRegister): Observable<PerfilRegister> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${url}/api/perfil`, perfilRegister, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: any): Observable<any> {
    console.error('Error en la solicitud:', error);
    return throwError('Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }
}

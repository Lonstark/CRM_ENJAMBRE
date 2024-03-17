import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import url from '../localhost';
import { Observable } from 'rxjs';
import { Menu } from 'src/app/models/Menu/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  // Obtener listado de menu
  getMenu(): Observable<Menu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Menu[]>(`${url}/api/menu`, { headers });
  }

  // Obtener listado de menús x perfil
  getMenuByProfile(idPerfil: number): Observable<Menu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Menu[]>(`${url}/api/menu/perfil/${idPerfil}`, { headers });
  }




  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

}

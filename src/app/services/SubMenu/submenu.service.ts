import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import url from '../localhost';

@Injectable({
  providedIn: 'root'
})
export class SubmenuService {

  constructor(private http: HttpClient) { }

  // Obtener listado de submenu
  getSubMenu(): Observable<Submenu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Submenu[]>(`${url}/api/submenu`, { headers });
  }

  // Obtener listado de submenu x idmenu
  getSubMenuByIdMenu(menuId: number): Observable<Submenu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Submenu[]>(`${url}/api/submenu/findByMenuId/${menuId}`, { headers });
  }
  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilSubMenuAccion } from 'src/app/models/PerfilSubMenuAccion/perfil-sub-menu-accion.model';
import url from '../localhost';
import { Menu } from 'src/app/models/Menu/menu.model';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import { Accion } from 'src/app/models/Accion/accion.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilSubMenuAccionService {

  constructor(private http: HttpClient) { }

  // Obtener listado de PerfilSubMenuAccion
  getAll(): Observable<PerfilSubMenuAccion[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PerfilSubMenuAccion[]>(`${url}/api/perfilsubmenuaccion`, { headers });
  }

  // Obtener listado de menús x perfil
  getMenuByProfile(idPerfil: number): Observable<Menu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Menu[]>(`${url}/api/perfilsubmenuaccion/menu/${idPerfil}`, { headers });
  }

  // Obtener listado de submenús por perfil y menú
  getSubmenuByProfileAndMenu(idPerfil: number, idMenu: number): Observable<Submenu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Submenu[]>(`${url}/api/perfilsubmenuaccion/submenu/${idPerfil}/${idMenu}`, { headers });
  }

  // Obtener listado de acciones por perfil y menú
  getAccionByProfileAndSubMenu(idPerfil: number, idSubMenu: number): Observable<Accion[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Accion[]>(`${url}/api/perfilsubmenuaccion/accion/${idPerfil}/${idSubMenu}`, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

}

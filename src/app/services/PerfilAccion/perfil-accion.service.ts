import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilAccion } from 'src/app/models/PerfilAccion/perfil-accion.model';
import url from '../localhost';
import { Menu } from 'src/app/models/Menu/menu.model';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import { Accion } from 'src/app/models/Accion/accion.model';
import { PerfilRegister } from 'src/app/models/PerfilRegister/perfil-register.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilAccionService {

  constructor(private http: HttpClient) { }

  // Obtener listado de PerfilSubMenuAccion
  getAll(): Observable<PerfilAccion[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PerfilAccion[]>(`${url}/api/perfil-accion`, { headers });
  }

  // Obtener listado de menús x perfil
  getMenuByProfile(idPerfil: number): Observable<Menu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Menu[]>(`${url}/api/perfil-accion/menu/${idPerfil}`, { headers });
  }

  // Obtener listado de submenús por perfil y menú
  getSubmenuByProfileAndMenu(idPerfil: number, idMenu: number): Observable<Submenu[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Submenu[]>(`${url}/api/perfil-accion/submenu/${idPerfil}/${idMenu}`, { headers });
  }

  // Obtener listado de acciones por perfil y menú
  getAccionByProfileAndSubMenu(idPerfil: number, idSubMenu: number): Observable<Accion[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Accion[]>(`${url}/api/perfil-accion/acciones/${idPerfil}/${idSubMenu}`, { headers });
  }

  // REGISTRAR PERFIL ACCION
  registerPerfilAndAcciones(perfilRegister: PerfilRegister): Observable<PerfilRegister> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${url}/api/perfil-accion`, perfilRegister, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }


}

import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import url from '../localhost';
import { Router } from '@angular/router';

import { Observable, catchError } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private router: Router) {

  }

    // generamos el token al iniciar la sesion
    public login(loginData: any) {
      return this.http.post(`${url}/auth/login`, loginData)
    }

    public getCurrentUser(): Observable<any> {
      const token = this.getToken();
      console.log('Token:', token);
      return this.http.get(`${url}/auth/actual-usuario`, {
        headers: { Authorization: `Bearer ${token}` },
      }).pipe(
        catchError((error) => {
          console.error('Error al obtener el usuario actual:', error);
          return [];
        })
      );
    }

    public loginUser(token: any) {
      localStorage.setItem('token', token)
    }

    public isLoggedIn() {
      let tokenStr = localStorage.getItem('token');
      if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
        return false;
      } else {
        return true;
      }
    }

    //cerramos sesión y eliminamos el token del localstorage
    public logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    }


    // Registrar un nuevo usuario
    registrarUsuario(usuario: Usuario): Observable<Usuario> {
      const token = this.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<Usuario>(`${url}/auth/register`, usuario, { headers });
    }

    //obtener el token
    public getToken() {
      return localStorage.getItem('token');
    }

    public setUser(user: any) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    public getUser() {
      let userStr = localStorage.getItem('user');
      if (userStr != null) {
        return JSON.parse(userStr);
      } else {
        this.logout();
        return null;
      }
    }

    public getUserRole(): string {
      let user = this.getUser();
      if (user && user.perfil && user.perfil.length > 0) {
        const perfil = user.perfil[0].nombre;
        return perfil;
      }
      // Manejar el caso en que no se pueda determinar el perfil
      console.warn('No se pudo determinar el perfil del usuario.');
      return 'UNKNOWN';
    }

    getUsuarios(): Observable<Usuario[]> {
      const token = this.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Usuario[]>(`${url}/api/usuarios`, { headers });
    }

}

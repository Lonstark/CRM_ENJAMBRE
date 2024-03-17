import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import url from '../localhost';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  // Obtener listado de clientes
  getClientes(): Observable<Cliente[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cliente[]>(`${url}/api/cliente`, { headers });
  }

  getActiveClientes(): Observable<Cliente[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cliente[]>(`${url}/api/cliente/listActivos`, { headers });
  }

  // Registrar un nuevo Cliente
  registrarCliente(cliente: Cliente): Observable<Cliente> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Cliente>(`${url}/api/cliente`, cliente, { headers });
  }

  // Obtener area por id
  getById(id:number): Observable<Cliente> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cliente>(`${url}/api/cliente/${id}`, { headers });
  }

  // Desactivar un cliente por su id
  desactivarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Cliente>(`${url}/api/cliente/desactivar/${id}`, cliente, { headers });
  }

  // Obtener token del servicio de usuario
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}

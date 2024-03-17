import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import url from '../localhost';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Venta } from 'src/app/models/Venta/venta';
import { Archivo } from 'src/app/models/Archivo/archivo';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  public getFileById(id: string): Observable<Uint8Array> {
    const token = this.getToken(); // Obtener el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Configurar los encabezados con el token

    return this.http.get(`${url}/api/files/${id}`, {
      responseType: 'arraybuffer',
      headers: headers // Pasar los encabezados con el token en la solicitud
    }).pipe(
      map((response: ArrayBuffer) => new Uint8Array(response))
    );
  }

  public getVentas(): Observable<Venta[]>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<Venta[]>(`${url}/api/ventas/listar`, { headers });
  }


  private getToken(): string | null {
    return localStorage.getItem('token'); // Obtener el token del localStorage
  }

}

import { Injectable } from '@angular/core';
import { UsuarioService } from '../Usuario/usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    if (!this.usuarioService.isLoggedIn()) {
      // Si el usuario no está autenticado, redirigir al componente de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}

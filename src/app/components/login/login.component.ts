import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  public usuario: Usuario = new Usuario();

  constructor(private usuarioService: UsuarioService, private router: Router){

  }

  ngOnInit(): void {
    if (this.usuarioService.isLoggedIn()) {
      // Si está autenticado, redirigir al dashboard u otra página
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    // Validar que se hayan ingresado las credenciales
    if (!this.usuario.email || !this.usuario.contrasenia) {
      console.error('Por favor, ingrese su correo electrónico y contraseña.');
      // Puedes mostrar un mensaje de error en tu formulario si lo deseas
      return;
    }

    // Utilizar la propiedad 'email' del objeto 'usuario' para crear las credenciales
    const loginData = {
      idUsuario: this.usuario.email,
      contrasenia: this.usuario.contrasenia
    };

    // Llamar al servicio para iniciar sesión
    this.usuarioService.login(loginData).subscribe(
      (data: any) => {
        console.log(data);
        this.usuarioService.loginUser(data.token);
        this.handleCurrentUser();
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);

        if (error.status === 403) {
          console.error('Credenciales incorrectas. Verifica tu usuario y contraseña.');
        } else {
          console.error('Otro tipo de error. Verifica la consola del servidor para obtener más detalles.');
        }
      }
    );
  }

  private handleCurrentUser() {
    this.usuarioService.getCurrentUser().subscribe(
      (user: any) => {
        this.usuarioService.setUser(user);
        console.log(user);
        this.redirectBasedOnUserRole();
      },
      (error) => {
        console.error('Error getting current user:', error);
        console.log(error);
        this.usuarioService.logout();
        // Redirigir a una página de error
        // this.router.navigate(['/error']);
      }
    );
  }

  private redirectBasedOnUserRole() {
    const userRole = this.usuarioService.getUserRole();
    this.router.navigate(['/dashboard']);
  }

}

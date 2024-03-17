import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isLoggedIn = false;
  usuarioActual: any;
  @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

  constructor(public usuarioService: UsuarioService, private router: Router){}

  ngOnInit(): void {
    this.usuarioService.getCurrentUser().subscribe(
      (user: any) => {
        this.usuarioActual = user;
        console.log(this.usuarioActual)
      },
      (error) => {
        console.error('Error al obtener el usuario actual:', error);
        // Trata el error según tus necesidades
      }
    );
  }

  public logout() {
    this.usuarioService.logout();
    window.location.reload();
  }

  toggleSidebarClick(){
    this.toggleSidebar.emit();
  }
}

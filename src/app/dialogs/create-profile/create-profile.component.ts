import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Accion } from 'src/app/models/Accion/accion.model';
import { Menu } from 'src/app/models/Menu/menu.model';
import { Perfil } from 'src/app/models/Perfil/perfil.model';
import { PerfilRegister } from 'src/app/models/PerfilRegister/perfil-register.model';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import { PerfilService } from 'src/app/services/Perfil/perfil.service';
import { PerfilAccionService } from 'src/app/services/PerfilAccion/perfil-accion.service';
import { PerfilSubMenuAccionService } from 'src/app/services/PerfilSubMenuAccion/perfil-sub-menu-accion.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  perfil: Perfil = new Perfil();

  menus: Menu[] = [];
  subMenus: Submenu[] = [];
  acciones: Accion[] = [];

  // ALMACENAMOS LAOS SUBMENUS POR EL ID DE UN MENU
  subMenusMap: Map<number, Submenu[]> = new Map<number, Submenu[]>();
  // ALMACENAMOS LAS ACCIONES POR EL ID DE UN SUBMENU
  accionesMap: Map<number, Accion[]> = new Map<number, Accion[]>();


  constructor(
    public dialogRef: MatDialogRef<CreateProfileComponent>,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private perfilAccionService: PerfilAccionService,
    private perfilSubMenuAccionService: PerfilSubMenuAccionService
  ) { }

  ngOnInit(): void {
    this.cargarMenuSubMenuAndAccion();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  toggleMenu(menu: Menu): void {
    menu.showSubMenu = !menu.showSubMenu;
    //console.log("IDMenu = " , menu)
    this.actualizarSubMenus(menu.idMenu!);
  }

  toggleSubMenu(submenu: Submenu): void {
    submenu.showSubMenu = !submenu.showSubMenu;
    //console.log("ID_SubMenu = " , submenu)
    this.actualizarAcciones(submenu.idSubmenu!);
  }

  toggleAcciones(accion: Accion): void {
    accion.showSubMenu = !accion.showSubMenu;
    //console.log("Accion = " , accion)
  }

  private cargarMenuSubMenuAndAccion(): void{
    this.usuarioService.getCurrentUser().subscribe(userProfile => {
      const perfilId = userProfile?.perfil[0]?.idPerfil;
      if (perfilId){
        this.perfilAccionService.getMenuByProfile(perfilId).subscribe(data => {
          this.menus = data;
        });
      }
    });
  }

  actualizarSubMenus(idMenu: number): void {
    this.usuarioService.getCurrentUser().subscribe(userProfile => {
      const perfilId = userProfile?.perfil[0]?.idPerfil;
      if (perfilId && idMenu) {
        this.perfilAccionService.getSubmenuByProfileAndMenu(perfilId, idMenu).subscribe(submenus => {
          //this.subMenus = submenus;
          this.subMenusMap.set(idMenu, submenus);
        });
      }
    });
  }

  actualizarAcciones(idSubMenu: number): void {

    this.usuarioService.getCurrentUser().subscribe(userProfile => {
      const perfilId = userProfile?.perfil[0]?.idPerfil;
      if (perfilId && idSubMenu) {
        this.perfilAccionService.getAccionByProfileAndSubMenu(perfilId, idSubMenu).subscribe(acciones => {
          //this.acciones = acciones;
          this.accionesMap.set(idSubMenu, acciones);
        });
      }
    });

  }


  // Método para registrar el perfil y las acciones asociadas
  registerPerfilAndAcciones(): void {
    // Obtener los submenús y acciones seleccionadas
    const submenusSeleccionados: Submenu[] = [];
    const accionesSeleccionadas: Accion[] = [];
    const menuSeleccionados = this.menus.filter(menu => menu.showSubMenu);

    this.subMenusMap.forEach((submenus, idMenu) => {
      submenusSeleccionados.push(...submenus.filter(submenu => submenu.showSubMenu));
    });

    this.accionesMap.forEach((acciones, idSubmenu) => {
      accionesSeleccionadas.push(...acciones.filter(accion => accion.showSubMenu));
    });

    console.log('Menús seleccionados:', menuSeleccionados);
    console.log('Submenús seleccionados:', submenusSeleccionados);
    console.log('Acciones seleccionadas:', accionesSeleccionadas);

    // Construir el objeto PerfilRegister
    const perfilRegister: PerfilRegister = {
      perfil: this.perfil,
      perfilAccion: []
    };

    // Iterar sobre los submenús seleccionados
    submenusSeleccionados.forEach(submenu => {
      const accionesSubmenu: Accion[] = this.accionesMap.get(submenu.idSubmenu!) || [];
      // Construir los objetos de acción y submenú para cada acción seleccionada
      accionesSubmenu.forEach(accion => {

        if(accion.showSubMenu){
          const perfilAccion: any = {
            accion: {
              nombre: accion.nombre,
              submenues: {
                idSubmenu: submenu.idSubmenu
              }
            }
          }
          // Agregar el objeto perfilSubMenuAccion al arreglo perfilSubMenuAccion
          perfilRegister.perfilAccion?.push(perfilAccion);
        }
      });
    });

    console.log('Datos a registrar:', perfilRegister);
    //return;
    // Llamar al servicio para registrar el perfil y acciones
    this.perfilAccionService.registerPerfilAndAcciones(perfilRegister).subscribe(
      response => {
        console.log('Perfil registrado con éxito:', response);
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Perfil '+perfilRegister.perfil?.nombre+' registrado correctamente!',
          showConfirmButton: false,
          timer: 1500 // Auto close alert after 1.5 seconds
        });
        // Restablecer el formulario o realizar otras acciones necesarias después del registro
      },
      error => {
        console.error('Error al registrar el perfil:', error);
        // Manejar errores o mostrar mensajes de error al usuario
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Hubo un error al registrar el perfil.',
        });
      }
    );

  }

}


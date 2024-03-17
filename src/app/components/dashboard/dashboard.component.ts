import { Component, OnInit, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import { Menu } from 'src/app/models/Menu/menu.model';
import { PerfilSubMenuAccionService } from 'src/app/services/PerfilSubMenuAccion/perfil-sub-menu-accion.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { PerfilAccionService } from 'src/app/services/PerfilAccion/perfil-accion.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('slideDown', [
      state('void', style({
        height: '0',
        opacity: '0'
      })),
      state('*', style({
        height: '*',
        opacity: '1'
      })),
      transition('void <=> *', animate('300ms ease-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  subMenusState: Record<number, boolean> = {};
  submenus: Record<number, Submenu[]> = {};

  menus: Menu[] = [];
  subMenus: Submenu[] = [];

  isHandset: boolean = false;
  isSideNavOpen: boolean = true;
  isExpanded: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver, private elementRef: ElementRef,
    private usuarioService: UsuarioService,
    private perfilAccionService: PerfilAccionService
  ) { }

  ngOnInit(): void {

    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      this.isHandset = result.matches;
      console.log("Is Handset:", this.isHandset);
      if (this.isHandset) {
        this.isExpanded = false;
        this.isSideNavOpen = false;
      } else {
        this.isSideNavOpen = true;
      }
    });

    // OBTENEMOS EL IDPERFIL DEL USUARIO LOGUEADO
    this.usuarioService.getCurrentUser().subscribe(userProfile => {
      const perfilId = userProfile?.perfil[0]?.idPerfil;
      //console.log("Perfil de Usuario obtenido: " + perfilId)
      if (perfilId) {
        // OBTENER LOS MENUS SEGUN EL PERFIL
        this.perfilAccionService.getMenuByProfile(perfilId).subscribe(data => {
          this.menus = data;
          //console.log("Menu disponibles : ", data );
          this.menus.forEach(menu => {
            if (menu.idMenu !== undefined) {
              this.subMenusState[menu.idMenu] = false;
            }
          });
          // OBTENER LOS SUBMENUS SEGUN EL MENU Y PERFIL
          this.menus.forEach(menu => {
            const idMenu = menu.idMenu ?? undefined;
            //console.log("Codigo Menu : " + idMenu + " perfil "+perfilId)
            if (idMenu !== undefined) {
              this.perfilAccionService.getSubmenuByProfileAndMenu(perfilId, idMenu).subscribe(submenus => {
                this.submenus[idMenu] = submenus;
                this.subMenus = submenus;
              });
            }
          });
        });
      }
    });

    // Prevenir la acción predeterminada del clic en todos los enlaces
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('routerLink') !== null) {
        event.preventDefault();
      }
    });
  }

  toggleSubMenu(menuId?: number) {
    if (menuId !== undefined) {
      // Cambiar el estado del submenú específico
      this.subMenusState[menuId] = !this.subMenusState[menuId];
    }
  }

  isSubMenuVisible(menuId?: number): boolean {
    return menuId !== undefined ? this.subMenusState[menuId] : false;
  }

  getSubMenusByMenuId(menuId: number): Menu[] {
    return [];
  }

  toggleSideNav() {
    if (this.isHandset) {
      if (this.isSideNavOpen) {
        this.isExpanded = false; // Cerrar el menú lateral
      } else {
        this.isExpanded = true; // Abrir el menú lateral
      }
      this.isSideNavOpen = !this.isSideNavOpen;
    } else {
      this.isSideNavOpen = !this.isSideNavOpen;
    }
  }
}

import { Accion } from "../Accion/accion.model";
import { Menu } from "../Menu/menu.model";
import { Perfil } from "../Perfil/perfil.model";
import { Submenu } from "../SubMenu/submenu.model";

export class PerfilSubMenuAccion {

  perfil?: Perfil;
  menu?: Menu;
  submenu?: Submenu;
  accion?: Accion[];

}

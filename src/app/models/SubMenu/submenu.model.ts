import { Accion } from "../Accion/accion.model";
import { Menu } from "../Menu/menu.model";

export class Submenu {
  idSubmenu?: number;
  nombre?: string;
  estado?: number;
  menu?: Menu;

  // OTRAS VARIABLES
  showSubMenu?: boolean;
  acciones?: Accion[];
}

import { Submenu } from "../SubMenu/submenu.model";

export class Accion {
  idAccion?: number;
  nombre?: string;
  estado?: number;
  submenues?: Submenu;


  showSubMenu?: boolean;
  idSubmenu?: number;
}



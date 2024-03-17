import { Submenu } from "../SubMenu/submenu.model";

export class Menu {
  
  idMenu?: number;
  nombre?: string;
  icono?: string;
  estado?: number;

  // OTRAS VARIABLES:
  showSubMenu?: boolean;
  subMenus?: Submenu[];
}

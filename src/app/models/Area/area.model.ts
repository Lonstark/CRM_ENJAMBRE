import { Empresa } from "../Empresa/empresa.model";

export class Area {
  [x: string]: any;
  idArea?: number;
  nombre?: string;
  descripcion?: string;
  estado?: number;
  empresas?: Empresa[];
}


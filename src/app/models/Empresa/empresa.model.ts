import { Cliente } from "../Cliente/cliente.model";

export class Empresa {
  idEmpresa?: number;
  ruc?: string;
  correo?: string;
  direccion?: string;
  descripcion?: string;
  estado?: number;
  clientes?: Cliente[];
}

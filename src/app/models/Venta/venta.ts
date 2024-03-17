import { Time } from "@angular/common";
import { Archivo } from "../Archivo/archivo";
import { CanalVenta } from "../CanalVenta/canal-venta";
import { TipoDocumento } from "../TipoDocumento/tipo-documento.model";
import { Ubigeo } from "../Ubigeo/ubigeo.model";
import { Usuario } from "../Usuario/usuario.model";
import { Certificado } from "../Certificado/certificado.model";
import { Zona } from "../Zona/zona";
import { Plan } from "../Plan/plan";

export class Venta {
  id?: number;
  usuario?: Usuario;
  certificado?: Certificado;
  zona?: Zona;
  agendada?: boolean;
  tipoVenta?: String;

  //Datos del cliente
  nombre?: String;
  apePat?: String;
  apeMat?: String;
  ubigeo?: Ubigeo;
  direccion?: String;
  coordenadas?: String;
  referencia?: String;
  tipoDoc?: TipoDocumento;
  documento?: String;
  nroUno?: String;
  nroDos?: String;
  nroTres?: String;
  whatsapp?: String;
  email?: String;
  fecProgramada?: Date;
  horaProgramada?: Time;
  canalVenta?: CanalVenta;
  tipoInmueble?: String;
  plan?: Plan;
  cuotasInstal?: number;
  cantMesh?: number;
  winbox?: String;
  nroPortar?: String;
  relacionPrecio?: String;
  obs?: String;

  venta?: Archivo[];
}

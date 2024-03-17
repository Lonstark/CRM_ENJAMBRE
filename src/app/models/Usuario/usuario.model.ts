import { Certificado } from "../Certificado/certificado.model";
import { Empresa } from "../Empresa/empresa.model";
import { Perfil } from "../Perfil/perfil.model";
import { TipoDocumento } from "../TipoDocumento/tipo-documento.model";
import { Ubigeo } from "../Ubigeo/ubigeo.model";
import { Zona } from "../Zona/zona";

export class Usuario {
  idUsuario?: string;
  nombres?: string;
  apellidos?: string;
  ubigeo?: Ubigeo;
  direccion?: string;
  referencia?: string;
  tipoDocumento?: TipoDocumento;
  documento?: string;
  fechaNacimiento?: string;
  email?: string;
  celular?: string;
  celularRef?: string;
  sexo?: string;
  ruc?: string;
  estadoCivil?: string;
  nombreConyuguente?: string;
  nhijos?: number;
  banco?: string;
  tipoCuenta?: string;
  moneda?: string;
  numeroCuenta?: string;
  ncci?: string;
  estado?: number;
  perfil?: Perfil[];
  zona?: Zona[];
  empresa?: Empresa[];
  certificados?: Certificado[]
  //
  contrasenia?: string;

}


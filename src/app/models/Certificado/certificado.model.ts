import { Cliente } from "../Cliente/cliente.model";
import { Empresa } from "../Empresa/empresa.model";

export class Certificado{
    idCertificado?: number;
    codigo?: string;
    empresa?:Empresa;
    cliente?:Cliente;
    descripcion?:string;
    estado?:number;
}

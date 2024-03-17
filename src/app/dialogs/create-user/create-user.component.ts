import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import * as $ from 'jquery';
import { Observer } from 'rxjs';
import 'select2';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { TipoDocumento } from 'src/app/models/TipoDocumento/tipo-documento.model';
import { Ubigeo } from 'src/app/models/Ubigeo/ubigeo.model';
import { Usuario } from 'src/app/models/Usuario/usuario.model';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { TipoDocumentoService } from 'src/app/services/TipoDocumento/tipo-documento.service';
import { UbigeoService } from 'src/app/services/Ubigeo/ubigeo.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, AfterViewInit {

  usuario: Usuario = new Usuario();
  certificados: any[] = [];
  tiposDocumentos: TipoDocumento[] = [];
  empresas: Empresa[] = [];
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  empresaSeleccionado: [] = [];
  departamentoSeleccionado: string = '';
  provinciaSeleccionado: string = '';
  distritoSeleccionado: string = '';
  genderSeleccionado: string = '';
  tipoDocumentoSeleccionado = 0;
  estadoCivilSeleccionado: string = '';

  generos : any =  {
    '1': 'Masculino',
    '2': 'Femenino',
    '3': 'Otros'
  };

  estadoCivil : any =  {
    '1': 'Soltero',
    '2': 'Casado',
    '3': 'Viudo',
    '4': 'Divorciado'
  };

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private tipoDocumentoService: TipoDocumentoService,
    private empresaService: EmpresaService,
    private ubigeoService: UbigeoService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarTiposDocumentos();
    this.cargarEmpresas();
    this.cargarDepartamentos();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  private cargarTiposDocumentos(): void {
    const observer: Observer<TipoDocumento[]> = {
      next: (data) => {
        this.tiposDocumentos = data;
      },
      error: (error) => {
        console.error('Error al obtener tipos de documentos:', error);
      },
      complete: () => {
      },
    };
    this.tipoDocumentoService.getTiposDocumentos().subscribe(observer);
  }

  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };
    this.empresaService.getEmpresas().subscribe(observer);
  }

  private cargarDepartamentos(): void {
    const observer: Observer<Ubigeo[]> = {
      next: (data) => {
        this.departamentos = data;
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };
    this.ubigeoService.getDepartamentos().subscribe(observer);
  }

  private cargarProvincias(departamento: string) {
    this.ubigeoService.getProvincias(departamento).subscribe((data: Ubigeo[]) => {
      this.provincias = data;
    });
  }

  private cargarDistritos(provincia: string) {
    this.ubigeoService.getDistritos(provincia).subscribe((data: Ubigeo[]) => {
      this.distritos = data;
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  initializeSelect2() {

    $('#selectEmpresa').select2();
    $('#selectEmpresa').val('0').trigger('change');
    $('#selectEmpresa').on('change', (event: any) => {
      this.empresaSeleccionado = $(event.target).val();
    });

    $('#selectDepartamento').select2();
    $('#selectDepartamento').val('0').trigger('change');
    $('#selectDepartamento').on('change', (event: any) => {
      $('#selectProvincia').val('0').trigger('change');
      $('#selectDistrito').val('0').trigger('change');
      this.departamentoSeleccionado = $(event.target).val();
      if (this.departamentoSeleccionado) {
        this.cargarProvincias(this.departamentoSeleccionado);
      }
    });

    $('#selectProvincia').select2();
    $('#selectProvincia').val('0').trigger('change');
    $('#selectProvincia').on('change', (event: any) => {
      this.provinciaSeleccionado = $(event.target).val();
      if (this.provinciaSeleccionado) {
        this.cargarDistritos(this.provinciaSeleccionado);
      }
    });

    $('#selectDistrito').select2();
    $('#selectDistrito').val('0').trigger('change');
    $('#selectDistrito').on('change', (event: any) => {
      this.distritoSeleccionado = $(event.target).val();
    });

    $('#selectGender').select2();
    $('#selectGender').val('0').trigger('change');
    $('#selectGender').on('change', (event: any) => {
      this.genderSeleccionado = $(event.target).val();
      const nombreGenero = this.generos[this.genderSeleccionado];
      this.genderSeleccionado = nombreGenero;
    });

    $('#selectDocument').select2();
    $('#selectDocument').val('0').trigger('change');
    $('#selectDocument').on('change', (event: any) => {
      this.tipoDocumentoSeleccionado = $(event.target).val();
    });

    $('#selectCivil').select2();
    $('#selectCivil').val('0').trigger('change');
    $('#selectCivil').on('change', (event: any) => {
      this.estadoCivilSeleccionado = $(event.target).val();
      const nombreGenero = this.estadoCivil[this.estadoCivilSeleccionado];
      this.estadoCivilSeleccionado = nombreGenero;
    });

    $('#selectBanco').select2();
    $('#selectBanco').val('0').trigger('change');



    $('#selectTipoCuenta').select2();
    $('#selectTipoCuenta').val('0').trigger('change');

    $('#selectMoneda').select2();
    $('#selectMoneda').val('0').trigger('change');

    $('#selectPerfil').select2();

    $('#selectZona').select2();
    $('#selectArea').select2();
    $('#selectSubArea').select2();


  }


  onRegistrar() : void {

    const codigoUsuario = this.usuario.idUsuario;
    const nombreUsuario = this.usuario.nombres;
    const apellidoUsuario = this.usuario.apellidos;
    const empresaUsuario = this.empresaSeleccionado;
    const genderUsuario = this.genderSeleccionado;
    const tipoDocumentoUsuario = this.tipoDocumentoSeleccionado;
    const documentoUsuario = this.usuario.documento;
    const fechaNacimientoUsuario = this.usuario.fechaNacimiento;
    const emailUsuario = this.usuario.email;
    const departamentolUsuario = this.departamentoSeleccionado;
    const provinciaUsuario = this.provinciaSeleccionado;
    const distritoUsuario = this.distritoSeleccionado;
    const direccionUsuario = this.usuario.direccion;
    const referenciaUsuario = this.usuario.referencia;
    const celularUsuario = this.usuario.celular;
    const celularReferenciaUsuario = this.usuario.celularRef;


    if (!codigoUsuario || codigoUsuario.trim() === '') {
      console.log("Ingrese el codigo");
      return;
    }
    if (!nombreUsuario || nombreUsuario.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }
    if (!apellidoUsuario || apellidoUsuario.trim() === '') {
      console.log("Ingrese el apellido");
      return;
    }

    console.log("Codigo : " , codigoUsuario);
    console.log("Nombre : " , nombreUsuario);
    console.log("Apellido : ", apellidoUsuario)
    console.log("Empresa : " ,empresaUsuario)
    console.log("Genero : " ,genderUsuario)
    console.log("Tipo Documento : " ,tipoDocumentoUsuario)
    console.log("Documento : " ,documentoUsuario)
    console.log("Fecha Naci : " ,fechaNacimientoUsuario)
    console.log("Email : " ,emailUsuario)
    console.log("Departamento : " ,departamentolUsuario)
    console.log("Provincia : " ,provinciaUsuario)
    console.log("Distrito : " ,distritoUsuario)
    console.log("Direccion : " ,direccionUsuario)
    console.log("Celular Usuario : " ,celularUsuario)
    console.log("Celular Referencia Usuario : " ,celularReferenciaUsuario)

  }

  agregarCertificado() {
    this.certificados.push({
      certificado: '',
      fechaInicio: '',
      fechaFin: '',
      vigente: null
    });
  }

  eliminarCertificado(index: number) {
    this.certificados.splice(index, 1);
  }

  validarVigencia(certificado: any) {
    if (certificado.fechaInicio && certificado.fechaFin) {
      const hoy = new Date();
      const inicio = new Date(certificado.fechaInicio);
      const fin = new Date(certificado.fechaFin);
      certificado.vigente = inicio <= hoy && hoy <= fin;
    } else {
      certificado.vigente = false;
    }
  }
}


/*

 initializeSelect2() {
    // Inicializar select2 en todas las pestañas
    $('#selectEmpresa').select2();
    $('#selectEmpresa').val('0').trigger('change');

    $('#selectGender').select2();
    $('#selectGender').val('0').trigger('change');

    $('#selectDocument').select2();
    $('#selectDocument').val('0').trigger('change');

    $('#selectCountry').select2();
    $('#selectCountry').val('0').trigger('change');

    $('#selectDepartamento').select2();
    $('#selectDepartamento').val('0').trigger('change');

    $('#selectProvincia').select2();
    $('#selectProvincia').val('0').trigger('change');

    $('#selectDistrito').select2();
    $('#selectDistrito').val('0').trigger('change');

    $('#selectCivil').select2();
    $('#selectCivil').val('0').trigger('change');

    $('#selectBanco').select2();
    $('#selectBanco').val('0').trigger('change');

    $('#selectTipoCuenta').select2();
    $('#selectTipoCuenta').val('0').trigger('change');

    $('#selectMoneda').select2();
    $('#selectMoneda').val('0').trigger('change');

    $('#selectPerfil').select2();

    $('#selectZona').select2();
    $('#selectArea').select2();
    $('#selectSubArea').select2();
  }

*/

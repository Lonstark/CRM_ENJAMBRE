import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as $ from 'jquery';
import { Observer } from 'rxjs';
import 'select2';
import { Certificado } from 'src/app/models/Certificado/certificado.model';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { CertificadoService } from 'src/app/services/Certificado/certificado.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit, AfterViewInit {
  empresas: Empresa[] = [];
  clientes: Cliente[] = [];
  idEmpresaSeleccionada: number = 0;
  idClienteSeleccionado: number = 0;

  certificado: Certificado = new Certificado();

  constructor(public dialogRef: MatDialogRef<CreateCertificateComponent>,
    private empresaService: EmpresaService,
    private certificadoService: CertificadoService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#empresas').select2();
    $('#empresas').val('0').trigger('change');
    // Utilizando una arrow function para mantener el contexto de this
    $('#empresas').on('change', () => {
      this.actualizarClientesPorEmpresa(+$('#empresas').val());
    });

    $('#clientes').select2();
    //$('#clientes').val('0').trigger('change');
  }

  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
        console.log(data);
        // Llamar a actualizarSelectClientes después de cargar las empresas
        this.actualizarSelectClientes();
      },
      error: (error) => {
        console.error('Error al obtener las Empresas:', error);
      },
      complete: () => {
      },
    };

    this.empresaService.getEmpresas().subscribe(observer);
  }

  actualizarClientesPorEmpresa(idEmpresa: number): void {
    const empresaSeleccionada = this.empresas.find(empresa => empresa.idEmpresa === idEmpresa);
    if (empresaSeleccionada) {
      this.clientes = empresaSeleccionada.clientes || [];
      this.idEmpresaSeleccionada = idEmpresa;
      console.log(this.clientes);
      console.log(this.idEmpresaSeleccionada);
      // Actualizar el select de clientes después de asignar los clientes
      this.actualizarSelectClientes();
    } else {
      this.clientes = [];
      this.actualizarSelectClientes();
    }
  }

  private actualizarSelectClientes(): void {
    $('#clientes').empty();
    $('#clientes').append('<option disabled value="0" selected>[Seleccione]</option>');
    this.clientes.forEach(cliente => {
      $('#clientes').append(`<option value="${cliente.idCliente}">${cliente.descripcion}</option>`);
    });
    $('#clientes').trigger('change');
  
    // Actualizar el ID del cliente seleccionado cuando se elige un cliente
    $('#clientes').on('change', () => {
      this.idClienteSeleccionado = +$('#clientes').val();
    });
  }


  onRegistrar(): void {
  if (!this.certificado.descripcion || this.certificado.descripcion.trim() === '') {
    console.log("Ingrese el nombre del certificado");
    return;
  }

  if (!this.idEmpresaSeleccionada || this.idEmpresaSeleccionada === 0) {
    console.log("Seleccione una empresa");
    return;
  }

  if (!this.idClienteSeleccionado || this.idClienteSeleccionado === 0) {
    console.log("Seleccione un cliente");
    return;
  }

  if (!this.certificado.estado || this.certificado.estado === null) {
    console.log("Seleccione un estado");
    return;
  }
  
  // Asignar el ID de la empresa y del cliente al certificado
  this.certificado.empresa = new Empresa();
  this.certificado.empresa.idEmpresa = this.idEmpresaSeleccionada;

  this.certificado.cliente = new Cliente();
  this.certificado.cliente.idCliente = this.idClienteSeleccionado;

  // Registrar Certificado
  this.certificadoService.registrarCertificado(this.certificado).subscribe({
    next: (certificadoRegistrado) => {
      console.log('Certificado registrado con éxito:', certificadoRegistrado);
      this.dialogRef.close();
      Swal.fire({
        icon: 'success',
        title: 'Certificado ' + certificadoRegistrado.descripcion + ' registrado correctamente!!',
        showConfirmButton: true,
        timer: 1500
      });
    },
    error: (error) => {
      console.error('Error al registrar certificado:', error);
    }
  } as Observer<Certificado>);
}

  onClose(): void {
    this.dialogRef.close();
  }
}
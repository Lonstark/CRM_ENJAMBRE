import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-update-certificate',
  templateUrl: './update-certificate.component.html',
  styleUrls: ['./update-certificate.component.css']
})
export class UpdateCertificateComponent implements OnInit, AfterViewInit {

  empresas: Empresa[] = [];
  clientes: Cliente[] = [];
  idEmpresaSeleccionada: number = 0;
  idClienteSeleccionado: number = 0;

  certificado: Certificado = new Certificado();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateCertificateComponent>,
    private empresaService: EmpresaService,
    private certificadoService: CertificadoService) {
    this.certificado = this.data.certificado;
    this.idEmpresaSeleccionada = this.data.idEmpresaSeleccionada;
    this.idClienteSeleccionado = this.data.idClienteSeleccionado;
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#empresas').select2();
    $('#empresas').on('change', () => {
      this.actualizarClientesPorEmpresa(+$('#empresas').val());
    });

    $('#clientes').select2();
    $('#clientes').on('change', () => {
      const idCliente = +$('#clientes').val();
      this.idClienteSeleccionado = idCliente; // Update idClienteSeleccionado
    });
  }

  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
        console.log(data);
        //this.actualizarSelectClientes(); // Llamar a actualizarSelectClientes después de cargar las empresas
        this.setSelectedValues(); // Establecer valores seleccionados después de cargar los datos
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
  }

  setSelectedValues() {
    // Set selected values for empresas and clientes
    setTimeout(() => {
      if (this.idEmpresaSeleccionada !== 0) {
        $('#empresas').val(this.idEmpresaSeleccionada.toString()).trigger('change');
      }
      if (this.idClienteSeleccionado !== 0) {
        $('#clientes').val(this.idClienteSeleccionado.toString()).trigger('change');
      }
    }, 500);
  }

  onEditar(): void {
    if (!this.certificado.descripcion || this.certificado.descripcion.trim() === '') {
      console.log("Ingrese la descripción del certificado");
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

    // Actualizar Certificado
    this.certificadoService.registrarCertificado(this.certificado).subscribe({
      next: (certificadoActualizado) => {
        console.log('Certificado actualizado con éxito:', certificadoActualizado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Certificado Actualizado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al actualizar Certificado:', error);
      }
    } as Observer<Certificado>);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import * as $ from 'jquery';
import 'select2';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.css']
})
export class UpdateCompanyComponent implements OnInit, AfterViewInit {
  empresa: Empresa = new Empresa();
  clientes: Cliente[] = [];
  clientesSeleccionadas: number[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateCompanyComponent>, private empresaService: EmpresaService, private clienteService: ClienteService) {
    this.empresa = this.data.empresa;
    this.clientesSeleccionadas = this.data.clientesSeleccionados;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#clientes').select2();

    // Obtener los IDs de las empresas seleccionadas como arreglo de strings
    const clientesSeleccionadasStrings = this.clientesSeleccionadas.map(String);
    console.log(clientesSeleccionadasStrings);

    // Esperar un breve momento para asegurarse de que las opciones se hayan cargado completamente
    setTimeout(() => {
      // Establecer las opciones seleccionadas en el control select2 solo si hay empresas seleccionadas
      if (clientesSeleccionadasStrings.length > 0) {
        $('#clientes').val(clientesSeleccionadasStrings).trigger('change');
      }
    }, 50);
    // Suscribirse al evento de cambio del control select2 para las empresas
    $('#clientes').on('change', () => {
      // Obtener los IDs de las empresas seleccionadas y actualizar la lista
      this.clientesSeleccionadas = $('#clientes').val().map(Number);
      console.log(this.clientesSeleccionadas);

    });
  }

  private cargarClientes(): void {
    const observer: Observer<Cliente[]> = {
      next: (data) => {
        this.clientes = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };

    this.clienteService.getClientes().subscribe(observer);
  }

  onEditar(): void {
    if (!this.empresa.descripcion || this.empresa.descripcion.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }

    if (!this.empresa.correo || this.empresa.correo.trim() === '') {
      console.log("Ingrese el correo");
      return;
    }
  
    if (!this.empresa.direccion || this.empresa.direccion.trim() === '') {
      console.log("Ingrese la direccion");
      return;
    }

    if (!this.empresa.ruc || this.empresa.ruc.trim() === '') {
      console.log("Ingrese el numero de RUC");
      return;
    }

    if (!this.empresa.estado || this.empresa.estado === null) {
      console.log("Ingrese el numero de RUC");
      return;
    }
  
    if (this.clientesSeleccionadas.length > 0) {
      // Asignar los IDs de las empresas seleccionadas al área
      this.empresa.clientes = this.clientesSeleccionadas.map(id => ({ idCliente: id }));
    } else {
      console.error('No se han seleccionado clientes.');
      return;
    }
    
    // Registrar Area
    this.empresaService.registrarEmpresa(this.empresa).subscribe({
      next: (empresaRegistrado) => {
        console.log('Empresa actualizada con éxito:', empresaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Empresa actualizada',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar area:', error);
      }
    } as Observer<Empresa>);
  }
}

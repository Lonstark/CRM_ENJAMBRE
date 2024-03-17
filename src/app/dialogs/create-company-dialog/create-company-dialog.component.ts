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
@Component({
  selector: 'app-create-company-dialog',
  templateUrl: './create-company-dialog.component.html',
  styleUrls: ['./create-company-dialog.component.css']
})
export class CreateCompanyDialogComponent implements OnInit , AfterViewInit{
  empresa: Empresa = {
    estado: 0
  }
  clientes: Cliente[] = [];
  clientesSeleccionadas: number[] = [];

  constructor(public dialogRef: MatDialogRef<CreateCompanyDialogComponent>, private empresaService: EmpresaService, private clienteService: ClienteService) { }

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
     $('#clientes').on('change', (event: any) => {
      this.clientesSeleccionadas = $(event.target).val();
      console.log(this.clientesSeleccionadas)
    });
  }

  onRegistrar(): void {
    if (!this.empresa.descripcion || this.empresa.descripcion.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }

    if (!this.empresa.ruc || this.empresa.ruc.trim() === '') {
      console.log("Ingrese el ruc");
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

    if (!this.empresa.estado || this.empresa.estado === 0) {
      console.log("Seleccione el estado");
      return;
    }

    if (this.clientesSeleccionadas.length > 0) {
      // Asignar los IDs de las empresas seleccionadas al área
      this.empresa.clientes = this.clientesSeleccionadas.map(id => ({ idCliente: id }));
    } else {
      console.log('No se han seleccionado clientes');
      return;
    }

    // Registrar Empresa
    this.empresaService.registrarEmpresa(this.empresa).subscribe({
      next: (empresaRegistrado) => {
        console.log('Empresa registrada con éxito:', empresaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Cliente registrado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar Empresa:', error);
      }
    } as Observer<Empresa>);
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

    this.clienteService.getActiveClientes().subscribe(observer);
  }

}

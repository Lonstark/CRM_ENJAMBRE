import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-client-dialog',
  templateUrl: './create-client-dialog.component.html',
  styleUrls: ['./create-client-dialog.component.css']
})
export class CreateClientDialogComponent implements OnInit {

  cliente: Cliente = {
    estado: 0 // Valor inicial seleccionado por defecto
  };
  constructor(
    public dialogRef: MatDialogRef<CreateClientDialogComponent>,
    private clienteService: ClienteService) { }


  ngOnInit(): void {
  }
  onClose(): void {
    this.dialogRef.close();
  }

  onRegistrar(): void {
    if (!this.cliente.descripcion || this.cliente.descripcion.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }

    if(!this.cliente.estado || this.cliente.estado === 0){
      console.log("Ingrese el estado");
      return;
    }

    // Registrar Cliente
    this.clienteService.registrarCliente(this.cliente).subscribe({
      next: (clienteRegistrado) => {
        console.log('Cliente registrado con éxito:', clienteRegistrado);
        this.dialogRef.close();
        //Alerta Exito
        Swal.fire({
          icon: 'success',
          title: 'Cliente registrado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar cliente:', error);
      }
    } as Observer<Cliente>);
  }
}

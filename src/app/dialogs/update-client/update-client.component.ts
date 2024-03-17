import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit{
  cliente: Cliente = new Cliente();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<UpdateClientComponent>,
    private clienteService: ClienteService){
      this.cliente = this.data.cliente
  }
  ngOnInit(): void {
    
  }
  
  onClose(): void {
    this.dialogRef.close();
  }

  onEditar(): void {
    if (!this.cliente.descripcion || this.cliente.descripcion.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }
  
    if (!this.cliente.estado || this.cliente.estado === 0) {
      console.log("Seleccione el estado");
      return;
    }

     // Registrar Area
     this.clienteService.registrarCliente(this.cliente).subscribe({
      next: (clienteRegistrado) => {
        console.log('Ciente actualizado con éxito:', clienteRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
      }
    } as Observer<Cliente>);
  }

   }
    
   

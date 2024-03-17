import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TipoDocumento } from 'src/app/models/TipoDocumento/tipo-documento.model';
import { TipoDocumentoService } from 'src/app/services/TipoDocumento/tipo-documento.service';
import Swal from 'sweetalert2';
import { Observer, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent implements OnInit {

  tipoDocumento: TipoDocumento =  {
    estado: 0 
  };

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>, private tipoDocumentoService: TipoDocumentoService) { }


  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onRegistrar(): void {
    // Verifica que la descripción no esté vacía antes de intentar registrar
    if (!this.tipoDocumento.descripcion || this.tipoDocumento.descripcion.trim() == '') {
      console.log('La descripción no puede estar vacía.');
      return;
    } 

    if (!this.tipoDocumento.estado || this.tipoDocumento.estado === 0) {
      console.log('El estado no puede estar vacio.');
      return;
    } 

    // Llama al servicio para registrar el nuevo documento
    this.tipoDocumentoService.registrarTiposDocumentos(this.tipoDocumento).subscribe({
      next: (tipoDocumento) => {
        console.log('Documento registrado con éxito:', tipoDocumento);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Documento ' + tipoDocumento.descripcion +' registrado con éxito.',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar documento:', error);
      }
    } as Observer<TipoDocumento>);
  }

}

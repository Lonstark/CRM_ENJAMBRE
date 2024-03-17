import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoDocumento } from 'src/app/models/TipoDocumento/tipo-documento.model';
import { TipoDocumentoService } from 'src/app/services/TipoDocumento/tipo-documento.service';
import Swal from 'sweetalert2';
import { Observer, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-update-document',
  templateUrl: './update-document.component.html',
  styleUrls: ['./update-document.component.css']
})
export class UpdateDocumentComponent implements OnInit {
  tipoDocumento: TipoDocumento = new TipoDocumento();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UpdateDocumentComponent>, private tipoDocumentoService: TipoDocumentoService) {
    this.tipoDocumento = this.data.documento
  }
  ngOnInit(): void {

  }
  onClose(): void {
    this.dialogRef.close();
  }

  onEditar(): void {
    if (!this.tipoDocumento.descripcion || this.tipoDocumento.descripcion.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }
  
    if (!this.tipoDocumento.estado || this.tipoDocumento.estado === 0) {
      console.log("Seleccione el estado");
      return;
    }

     // Registrar Area
     this.tipoDocumentoService.registrarTiposDocumentos(this.tipoDocumento).subscribe({
      next: (documentoRegistrado) => {
        console.log('Tipo Documento actualizado con éxito:', documentoRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Tipo Documento actualizado',
          showConfirmButton: true,
          timer: 1500
        });
        
      },
      error: (error) => {
        console.error('Error al actualizar Tipo Documento:', error);
      }
    } as Observer<TipoDocumento>);
  }
}

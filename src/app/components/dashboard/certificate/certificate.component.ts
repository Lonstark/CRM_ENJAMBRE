import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Certificado } from 'src/app/models/Certificado/certificado.model';
import { CertificadoService } from 'src/app/services/Certificado/certificado.service';
import { CreateCertificateComponent } from 'src/app/dialogs/create-certificate/create-certificate.component';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateCertificateComponent } from 'src/app/dialogs/update-certificate/update-certificate.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements AfterViewInit,OnInit{
  displayedColumns: string[] = ['position', 'codigo','empresa','cliente','description','status','actions'];
  dataSource = new MatTableDataSource<Certificado>();
  certificados: Certificado[] = []
  
  constructor(
    public dialog: MatDialog,
    private certificadoService:CertificadoService
    ) { }

  ngOnInit(): void {
    this.cargarCertificados();
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  openNuevoCertificadoDialog(): void {
    const dialogRef = this.dialog.open(CreateCertificateComponent, {
      width: '500px',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      this.cargarCertificados();
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
    });
  }

  openUpdateCertificadoDialog(id: number): void {
    // Obtener los datos del certificado con el ID proporcionado
    this.certificadoService.getById(id).subscribe(certificado => {
      // Aquí obtienes el ID de la empresa y el ID del cliente del certificado
      const idEmpresaSeleccionada = certificado.empresa?.idEmpresa || 0;
      const idClienteSeleccionado = certificado.cliente?.idCliente || 0;
      console.log(idEmpresaSeleccionada, idClienteSeleccionado)
      const dialogRef = this.dialog.open(UpdateCertificateComponent, {
        width: '500px',
        data: { 
          certificado: certificado,
          idEmpresaSeleccionada: idEmpresaSeleccionada,
          idClienteSeleccionado: idClienteSeleccionado
        }
        // Otras opciones de configuración del diálogo, como tamaño, posición, etc.
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarCertificados();
        // Acciones posteriores al cierre del diálogo, si es necesario
      });
    });
  }

  private cargarCertificados(): void {
    const observer: Observer<Certificado[]> = {
      next: (data) => {
        this.certificados = data;
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener los Certificados:', error);
      },
      complete: () => {
        console.log("Se cargaron los Certificados")
      },
    };

    this.certificadoService.getCertificado().subscribe(observer);
  }
  confirmarDesactivarCertificado(id: number, certificado: Certificado): void {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres desactivar este certificado ' +certificado.descripcion + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al método del servicio para desactivar el área
        this.certificadoService.desactivarCertificado(id, certificado).pipe(
          tap(() => {
            // Manejo de la respuesta
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El certificado se ha desactivado correctamente.',
              confirmButtonText: 'Aceptar'
            });
            // Actualizar la lista de áreas después de desactivar
            this.cargarCertificados();
          }),
          catchError((error) => {
            // Manejo de errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al desactivar el certificado.',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error al desactivar el certificado:', error);
            return of(null);
          }),
          finalize(() => {
            // Realizar tareas de limpieza, si es necesario
          })
        ).subscribe();
      }
    });
  }

}
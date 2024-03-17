import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogComponent } from 'src/app/dialogs/create-dialog/create-dialog.component';
import { TipoDocumento } from 'src/app/models/TipoDocumento/tipo-documento.model';
import { TipoDocumentoService } from 'src/app/services/TipoDocumento/tipo-documento.service';
import { Observer } from 'rxjs';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateDocumentComponent } from 'src/app/dialogs/update-document/update-document.component';
import * as $ from 'jquery';
import 'select2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['position', 'name', 'status','actions'];
  dataSource = new MatTableDataSource<TipoDocumento>(); // Usa TipoDocumento directamente

  tiposDocumentos: TipoDocumento[] = [];

  selectedEstado: number | string = 'Todos';

  constructor(
    public dialog: MatDialog,
    private tipoDocumentoService: TipoDocumentoService,
    private empresaService: EmpresaService,
    private clienteService: ClienteService
  ) {}

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  ngOnInit() {
    this.cargarTiposDocumentos();
  }


  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    setTimeout(() => {
      this.initializeSelect2();
    });
  }


  initializeSelect2(){
    $('#selectEstados').select2();

    $('#selectEstados').on('select2:select', (event) => {
      const selectedOption = $(event.currentTarget).find("option:selected");
      this.selectedEstado = selectedOption.val(); // Actualizar el valor seleccionado
      this.applyFilterConcat(); // Aplicar el filtro
    });
    
  }

  openNuevoDialog(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '500px',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El diálogo se ha cerrado');
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
      this.cargarTiposDocumentos();
    });
  }

  openUpdateDocumentoDialog(id: number): void {
    // Obtener los datos del área con el ID proporcionado
    this.tipoDocumentoService.getById(id).subscribe(documento => {
      const dialogRef = this.dialog.open(UpdateDocumentComponent, {
        width: '500px',
        data: { 
          documento: documento
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarTiposDocumentos();
      });
    });
  }

  private cargarTiposDocumentos(): void {
    const observer: Observer<TipoDocumento[]> = {
      next: (data) => {
        this.tiposDocumentos = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener tipos de documentos:', error);
      },
      complete: () => {
        console.log("Se cargaron los tipos de documentos")
      },
    };

    this.tipoDocumentoService.getTiposDocumentos().subscribe(observer);
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value;
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : '';
  }

  applyFilterConcat(): void {
    const estadoFilter = this.selectedEstado !== 'Todos' ? this.selectedEstado.toString() : null;
    let filteredData = this.tiposDocumentos.filter(cliente => {
      let estadoMatches = true;
      if (estadoFilter !== null && cliente.estado?.toString() !== estadoFilter) {
        estadoMatches = false;
      }
      return estadoMatches;
    });
    this.dataSource.data = filteredData;
  }

  confirmarDesactivarDocumento(id: number, documento: TipoDocumento): void {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres desactivar el documento ' + documento.descripcion + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al método del servicio para desactivar el área
        this.tipoDocumentoService.desactivarDocumento(id, documento).pipe(
          tap(() => {
            // Manejo de la respuesta
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El cliente se ha desactivado correctamente.',
              confirmButtonText: 'Aceptar'
            });
            // Actualizar la lista de áreas después de desactivar
            this.cargarTiposDocumentos();
          }),
          catchError((error) => {
            // Manejo de errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al desactivar el cliente.',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error al desactivar el área:', error);
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
import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientDialogComponent } from 'src/app/dialogs/create-client-dialog/create-client-dialog.component';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { Observer } from 'rxjs';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateClientComponent } from 'src/app/dialogs/update-client/update-client.component';
import * as $ from 'jquery';
import 'select2';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements AfterViewInit, OnInit{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  displayedColumns: string[] = ['position', 'name','status','actions'];
  dataSource = new MatTableDataSource<Cliente>();
  empresas: Empresa[] = [];
  clientes: Cliente[] = [];

  selectedEstado: number | string = 'Todos';

  constructor(
    public dialog: MatDialog,
    private empresaService: EmpresaService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarCliente();

     // Obtener el nombre del SubMenú basado en la URL actual
     const nombreSubMenuActual = this.obtenerNombreSubMenuActual();
     console.log("Nombre del SubMenú Actual:", nombreSubMenuActual);
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

  applyFilter(event: any): void {
    const filterValue = event?.target?.value;
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : '';
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      const idClienteMatches = data.idCliente!.toString().includes(filter);
      const nombreMatches = data.descripcion!.toLowerCase().includes(filter);
      return idClienteMatches || nombreMatches;
    };
  }

  applyFilterConcat(): void {
    const estadoFilter = this.selectedEstado !== 'Todos' ? this.selectedEstado.toString() : null;
    let filteredData = this.clientes.filter(cliente => {
      let estadoMatches = true;
      if (estadoFilter !== null && cliente.estado?.toString() !== estadoFilter) {
        estadoMatches = false;
      }
      return estadoMatches;
    });
    this.dataSource.data = filteredData;
  }

  openNuevoClienteDialog(): void {
    const dialogRef = this.dialog.open(CreateClientDialogComponent, {
      width: '500px',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
      this.cargarCliente();
      
    });
  }

  openUpdateClienteDialog(id: number): void {
    // Obtener los datos del área con el ID proporcionado
    this.clienteService.getById(id).subscribe(cliente => {
      const dialogRef = this.dialog.open(UpdateClientComponent, {
        width: '500px',
        data: { 
          cliente: cliente
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarCliente();
      });
    });
  }

  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };

    this.empresaService.getEmpresas().subscribe(observer);
  }

  private cargarCliente(): void {
    const observer: Observer<Cliente[]> = {
      next: (data) => {
        this.clientes = data;
        this.dataSource.data = data
      },
      error: (error) => {
        console.error('Error al obtener los Clientes:', error);
      },
      complete: () => {
      },
    };

    this.clienteService.getClientes().subscribe(observer);
  }


  private obtenerNombreSubMenuActual(): string {
    // Obtener la URL actual
    const urlActual = window.location.href;
    // Dividir la URL por las barras y tomar la última parte que corresponde al nombre del SubMenú
    const partesURL = urlActual.split('/');
    const nombreSubMenu = partesURL[partesURL.length - 1];
    return nombreSubMenu;
  }


  confirmarDesactivarCliente(id: number, cliente: Cliente): void {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres desactivar al cliente ' + cliente.descripcion + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al método del servicio para desactivar el área
        this.clienteService.desactivarCliente(id, cliente).pipe(
          tap(() => {
            // Manejo de la respuesta
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El cliente se ha desactivado correctamente.',
              confirmButtonText: 'Aceptar'
            });
            // Actualizar la lista de áreas después de desactivar
            this.cargarCliente();
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

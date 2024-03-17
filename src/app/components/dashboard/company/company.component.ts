import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateCompanyDialogComponent } from 'src/app/dialogs/create-company-dialog/create-company-dialog.component';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { Observer } from 'rxjs';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import Swal from 'sweetalert2';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateCompanyComponent } from 'src/app/dialogs/update-company/update-company.component';
import * as $ from 'jquery';
import 'select2';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  displayedColumns: string[] = ['position', 'name', 'ruc', 'email', 'address', 'clientes', 'status', 'actions'];

  dataSource = new MatTableDataSource<Empresa>();

  empresas: Empresa[] = [];
  clientes: Cliente[] = [];

  selectedCliente: number | string = 'Todos';
  selectedEstado: number | string = 'Todos';

  constructor(
    public dialog: MatDialog,
    private empresaService: EmpresaService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarCliente();
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
    $('#selectedCliente').select2();
    $('#selectedEstado').select2();
    $('#selectedCliente').on('select2:select', (event) => {
      const selectedOption = $(event.currentTarget).find("option:selected");
      this.selectedCliente = selectedOption.val(); // Actualizar el valor seleccionado
      this.applyFilterConcat(); // Aplicar el filtro
    });
    $('#selectEstados').on('select2:select', (event) => {
      const selectedOption = $(event.currentTarget).find("option:selected");
      this.selectedEstado = selectedOption.val(); // Actualizar el valor seleccionado
      this.applyFilterConcat(); // Aplicar el filtro
    });
    
  }


  applyFilter(event: any): void {
    const filterValue = event?.target?.value;
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : '';
    this.dataSource.filterPredicate = (data: Empresa, filter: string) => {
      const idEmpresaMatches = data.idEmpresa!.toString().includes(filter);
      const correoMatches = data.correo!.toLowerCase().includes(filter);
      const descripcionMatches = data.descripcion!.toLowerCase().includes(filter);
      const rucMatches = data.ruc!.toLowerCase().includes(filter);
      const direccionMatches = data.direccion!.toLowerCase().includes(filter);
      const empresasMatches = this.formatClientes(data.clientes!).toLowerCase().includes(filter);
      return idEmpresaMatches || correoMatches || descripcionMatches || empresasMatches || rucMatches || direccionMatches;
    };
  }

  applyFilterConcat(): void {
    const clienteFilter = this.selectedCliente !== 'Todos' ? parseInt(this.selectedCliente.toString(), 10) : null;
    const estadoFilter = this.selectedEstado !== 'Todos' ? this.selectedEstado.toString() : null;
    let filteredData = this.empresas.filter(empresa => {
      let clientesMatches = true;
      let estadoMatches = true;
      if (clienteFilter !== null && (!empresa.clientes || !empresa.clientes.some(empresa => empresa.idCliente === clienteFilter))) {
        clientesMatches = false;
      }
      if (estadoFilter !== null && empresa.estado?.toString() !== estadoFilter) {
        estadoMatches = false;
      }
      return clientesMatches && estadoMatches;
    });
    this.dataSource.data = filteredData;
  }

  openNuevaEmpresaDialog(): void {
    const dialogRef = this.dialog.open(CreateCompanyDialogComponent, {
      width: '500px',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
      this.cargarEmpresas();
    });
  }

  openUpdateEmpresaDialog(id: number): void {
    // Obtener los datos del área con el ID proporcionado
    this.empresaService.getById(id).subscribe(empresa => {
      // Obtener las empresas seleccionadas
      const clientesSeleccionados = empresa.clientes?.map(cliente => cliente.idCliente);
      
      const dialogRef = this.dialog.open(UpdateCompanyComponent, {
        width: '500px',
        data: { 
          empresa: empresa, 
          clientesSeleccionados: clientesSeleccionados // Pasar las empresas seleccionadas al diálogo
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarEmpresas();
      });
    });
  }
  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
        console.log("Se cargaron las empresas")
      },
    };

    this.empresaService.getEmpresas().subscribe(observer);
  }

  private cargarCliente(): void {
    const observer: Observer<Cliente[]> = {
      next: (data) => {
        this.clientes = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener los Clientes:', error);
      },
      complete: () => {
        console.log("Se cargaron los Clientes")
      },
    };

    this.clienteService.getActiveClientes().subscribe(observer);
  }

  formatClientes(clientes: Cliente[]): string {
    if (clientes && clientes.length > 0) {
      return clientes.map(cliente => cliente.descripcion).join(', ');
    } else {
      return 'N/A';
    }
  }

  confirmarDesactivarEmpresa(id: number, empresa: Empresa): void {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres desactivar la empresa ' + empresa.descripcion + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al método del servicio para desactivar el área
        this.empresaService.desactivarEmpresa(id, empresa).pipe(
          tap(() => {
            // Manejo de la respuesta
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La empresa se ha desactivado correctamente.',
              confirmButtonText: 'Aceptar'
            });
            // Actualizar la lista de áreas después de desactivar
            this.cargarEmpresas();
          }),
          catchError((error) => {
            // Manejo de errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al desactivar la empresa.',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error al desactivar la empresa:', error);
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

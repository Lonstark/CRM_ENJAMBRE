import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Area } from 'src/app/models/Area/area.model';
import { AreaService } from 'src/app/services/Area/area.service';
import { Observer } from 'rxjs';
import { CreateAreaDialogComponent } from 'src/app/dialogs/create-area-dialog/create-area-dialog.component';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { PerfilSubMenuAccionService } from 'src/app/services/PerfilSubMenuAccion/perfil-sub-menu-accion.service';
import { Accion } from 'src/app/models/Accion/accion.model';
import { Menu } from 'src/app/models/Menu/menu.model';
import { Submenu } from 'src/app/models/SubMenu/submenu.model';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PerfilAccionService } from '../../../services/PerfilAccion/perfil-accion.service';
import { UpdateAreaComponent } from 'src/app/dialogs/update-area/update-area.component';
import * as $ from 'jquery';
import 'select2';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements AfterViewInit,OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  codigoSubMenuActivo: number | undefined;

  displayedColumns: string[] = ['position', 'name','description','empresa','status','actions'];
  dataSource = new MatTableDataSource<Area>();

  selectedEmpresa: number | string = 'Todos';
  selectedEstado: number | string = 'Todos';

  areas: Area[] = []
  empresas: Empresa[] = []
  clientes: Cliente[] = []
  acciones: Accion[] = []
  menus: Menu[] = [];
  subMenus: Submenu[] = [];
  botonesAcciones: any[] = [];

  constructor(
    public dialog: MatDialog,
    private areaService:AreaService,
    private empresaService:EmpresaService,
    private clienteService:ClienteService,
    private usuarioService: UsuarioService,
    private perfilAccionService: PerfilAccionService,
  ) { }

  ngOnInit(): void {
    this.cargarArea();
    this.cargarCliente();
    this.cargarEmpresas();
    this.cargarAcciones();
    this.initializeSelect2();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.page.subscribe(() => {
      //this.cargarAcciones();
      });
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    setTimeout(() => {
      this.initializeSelect2();
    });
  }

  initializeSelect2(){
    $('#selectEmpresas').select2();
    $('#selectEstados').select2();
    $('#selectEmpresas').on('select2:select', (event) => {
      const selectedOption = $(event.currentTarget).find("option:selected");
      this.selectedEmpresa = selectedOption.val(); // Actualizar el valor seleccionado
      this.applyFilterConcat(); // Aplicar el filtro
    });
    $('#selectEstados').on('select2:select', (event) => {
      const selectedOption = $(event.currentTarget).find("option:selected");
      this.selectedEstado = selectedOption.val(); // Actualizar el valor seleccionado
      this.applyFilterConcat(); // Aplicar el filtro
    });
    
  }

  openNuevaAreaDialog(): void {
    const dialogRef = this.dialog.open(CreateAreaDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      this.cargarArea();
      //this.cargarAcciones();
    });
  }

  openUpdateAreaDialog(id: number): void {
    // Obtener los datos del área con el ID proporcionado
    this.areaService.getById(id).subscribe(area => {
      // Obtener las empresas seleccionadas
      const empresasSeleccionadas = area.empresas?.map(empresa => empresa.idEmpresa);

      const dialogRef = this.dialog.open(UpdateAreaComponent, {
        width: '500px',
        data: {
          area: area,
          empresasSeleccionadas: empresasSeleccionadas // Pasar las empresas seleccionadas al diálogo
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarArea();
      });
    });
  }

  private cargarArea(): void {
    const observer: Observer<Area[]> = {
      next: (data) => {
        this.areas = data;
        this.dataSource.data = data;
        console.log(data)
      },
      error: (error) => {
        console.error('Error al obtener las Areas:', error);
      },
      complete: () => {
      },
    };
    this.areaService.getAreas().subscribe(observer);
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
    this.empresaService.getActiveEmpresas().subscribe(observer);
  }

  private cargarCliente(): void {
    const observer: Observer<Cliente[]> = {
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al obtener los Clientes:', error);
      },
      complete: () => {
      },
    };
    this.clienteService.getClientes().subscribe(observer);
  }

  private cargarAcciones(): void {
    this.usuarioService.getCurrentUser().subscribe(userProfile => {
      const perfilId = userProfile?.perfil[0]?.idPerfil;
      if(perfilId){
        this.perfilAccionService.getMenuByProfile(perfilId).subscribe(data => {
          this.menus = data;

          this.menus.forEach(menu => {
            const idMenu = menu.idMenu ?? undefined;
            if (idMenu !== undefined) {
              this.perfilAccionService.getSubmenuByProfileAndMenu(perfilId, idMenu).subscribe(submenus => {
                this.subMenus = submenus;
                //console.log("sub_menus " , submenus)
                const nombreSubMenuActual = this.obtenerNombreSubMenuActual();
                console.log("Nombre del SubMenú Actual:", nombreSubMenuActual);

                this.subMenus.forEach(submenu => {
                  const idSubMenu = submenu.idSubmenu;
                  const nombreSubMenu = submenu.nombre;
                  if (nombreSubMenu === nombreSubMenuActual) {
                    console.log("¡El SubMenú coincide con la URL actual!");
                    console.log("IDSubMenu : " + idSubMenu + " perfil " + perfilId);

                    this.perfilAccionService.getAccionByProfileAndSubMenu(perfilId,idSubMenu!).subscribe(data => {
                      //this.acciones.push(...data);
                      this.acciones=data;
                      console.log("Acciones: " , data)
                      // Obtener los nombres de las acciones
                      const nombresAcciones = data.map(accion => accion.nombre);

                      // Verificar si el nombre de la acción coincide con los nombres esperados
                      const nombreActualizar = 'Actualizar';
                      const nombreEliminar = 'Eliminar';
                      const nombreRegistrar = 'Registrar';
                      const botones = document.querySelectorAll('.btn');
                      botones.forEach(boton => {
                        if (boton.classList.contains('btnUpdate')) {
                          if (!nombresAcciones.includes(nombreActualizar)) {
                            //boton.setAttribute('disabled', 'true');
                            boton.classList.add('d-none');
                          }
                        } else if (boton.classList.contains('btnDelete')) {
                          if (!nombresAcciones.includes(nombreEliminar)) {
                            //boton.setAttribute('disabled', 'true');
                            boton.classList.add('d-none');
                          }
                        } else if (boton.classList.contains('btnRegister')) {
                          if (!nombresAcciones.includes(nombreRegistrar)) {
                            //boton.setAttribute('disabled', 'true');
                            boton.classList.add('d-none');
                          }
                        }

                      });


                    });

                  }
                });

              });
            }
          });
        });
      }
    });
  }

  private obtenerNombreSubMenuActual(): string {
    // Obtener la URL actual
    const urlActual = window.location.href;
    // Dividir la URL por las barras y tomar la última parte que corresponde al nombre del SubMenú
    const partesURL = urlActual.split('/');
    const nombreSubMenu = partesURL[partesURL.length - 1];
    return nombreSubMenu;
  }

  formatEmpresas(empresas: Empresa[]): string {
    if (empresas && empresas.length > 0) {
      return empresas.map(empresa => empresa.descripcion).join(', ');
    } else {
      return 'N/A';
    }
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value;
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : '';
    this.dataSource.filterPredicate = (data: Area, filter: string) => {
      const idAreaMatches = data.idArea!.toString().includes(filter);
      const nombreMatches = data.nombre!.toLowerCase().includes(filter);
      const descripcionMatches = data.descripcion!.toLowerCase().includes(filter);
      const empresasMatches = this.formatEmpresas(data.empresas!).toLowerCase().includes(filter);
      return idAreaMatches || nombreMatches || descripcionMatches || empresasMatches;
    };
  }

  applyFilterConcat(): void {
    const empresaFilter = this.selectedEmpresa !== 'Todos' ? parseInt(this.selectedEmpresa.toString(), 10) : null;
    const estadoFilter = this.selectedEstado !== 'Todos' ? this.selectedEstado.toString() : null;
    let filteredData = this.areas.filter(area => {
      let empresaMatches = true;
      let estadoMatches = true;
      if (empresaFilter !== null && (!area.empresas || !area.empresas.some(empresa => empresa.idEmpresa === empresaFilter))) {
        empresaMatches = false;
      }
      if (estadoFilter !== null && area.estado?.toString() !== estadoFilter) {
        estadoMatches = false;
      }
      return empresaMatches && estadoMatches;
    });
    this.dataSource.data = filteredData;
  }


  realizarAccion(id: number): void {
    // Aquí puedes implementar la lógica para manejar la acción correspondiente al id proporcionado
    console.log('Se ha seleccionado la acción con id:', id);
  }

  confirmarDesactivarArea(id: number, area: Area): void {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres desactivar este área ' +area.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al método del servicio para desactivar el área
        this.areaService.desactivarArea(id, area).pipe(
          tap(() => {
            // Manejo de la respuesta
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El área se ha desactivado correctamente.',
              confirmButtonText: 'Aceptar'
            });
            // Actualizar la lista de áreas después de desactivar
            this.cargarArea();
          }),
          catchError((error) => {
            // Manejo de errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al desactivar el área.',
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

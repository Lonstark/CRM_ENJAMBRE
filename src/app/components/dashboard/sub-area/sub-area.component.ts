import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Subarea } from 'src/app/models/SubArea/subarea.model';
import { SubareaService } from 'src/app/services/SubArea/subarea.service';
import { MatSort } from '@angular/material/sort';
import { Area } from 'src/app/models/Area/area.model';
import { AreaService } from 'src/app/services/Area/area.service';
import { CreateSubareaComponent } from 'src/app/dialogs/create-subarea/create-subarea.component';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { UpdateSubareaComponent } from 'src/app/dialogs/update-subarea/update-subarea.component';

@Component({
  selector: 'app-sub-area',
  templateUrl: './sub-area.component.html',
  styleUrls: ['./sub-area.component.css']
})
export class SubAreaComponent implements AfterViewInit,OnInit{

  displayedColumns: string[] = ['position','name','description','area','status','actions'];
  dataSource = new MatTableDataSource<Subarea>();

  selectedArea: number | string = 'Todos';
  selectedEstado: number | string = 'Todos';

  subareas: Subarea[] = []
  areas: Area[] = []

  constructor(
    public dialog: MatDialog,
    private subareaService:SubareaService,
    private areaService:AreaService,
    ) { }

  ngOnInit(): void {
    this.cargarSubArea();
    this.cargarArea();
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  openNuevaSubAreaDialog(): void {
    const dialogRef = this.dialog.open(CreateSubareaComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      this.cargarSubArea();
    });
  }

  openUpdateSubAreaDialog(id: number): void {
    // Obtener los datos del área con el ID proporcionado
    this.subareaService.getById(id).subscribe(subArea => {
      // Obtener el ID del área seleccionada
      const idAreaSeleccionada = subArea.area ? subArea.area.idArea : 0; // Obtén el ID del área o 0 si no está definido

      const dialogRef = this.dialog.open(UpdateSubareaComponent, {
        width: '500px',
        data: { 
          subArea: subArea,
          idAreaSeleccionada: idAreaSeleccionada // Pasar solo el ID del área seleccionada al componente
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo se ha cerrado');
        this.cargarSubArea();
      });
    });
}

  private cargarSubArea(): void {
    const observer: Observer<Subarea[]> = {
      next: (data) => {
        this.subareas = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener las SubAreas:', error);
      },
      complete: () => {
      },
    };
    this.subareaService.getSubAreas().subscribe(observer);
  }


  private cargarArea(): void {
    const observer: Observer<Area[]> = {
      next: (data) => {
        this.areas = data;
      },
      error: (error) => {
        console.error('Error al obtener las Areas:', error);
      },
      complete: () => {
      },
    };
    this.areaService.getAreas().subscribe(observer);
  }


  applyFilter(event: any): void {
    const filterValue = event?.target?.value;
    this.dataSource.filter = filterValue ? filterValue.trim().toLowerCase() : '';
  }

applyFilterConcat(): void {
  const selectedAreaId = this.selectedArea !== 'Todos' ? parseInt(this.selectedArea.toString(), 10) :  null; // Convertir a número
  const estadoFilter = this.selectedEstado !== 'Todos' ? this.selectedEstado.toString() : null;

  let filteredData = this.subareas.filter(subarea => {
    let areaMatches = true;
    let estadoMatches = true;

    const selectedArea = this.areas.find(area => area.idArea === selectedAreaId);
    if (!selectedArea) {
      areaMatches = true;
    } else {
      if (subarea.area && subarea.area.idArea !== selectedAreaId) {
        areaMatches = false;
      }
    }
    if (estadoFilter !== null && subarea.estado?.toString() !== estadoFilter) {
      estadoMatches = false;
    }
    return areaMatches && estadoMatches;
  });
  this.dataSource.data = filteredData;
}


confirmarDesactivarSubArea(id: number, subarea: Subarea): void {
  // Mostrar cuadro de diálogo de confirmación
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres desactivar este sub-area ' +subarea.nombre + '?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Llamada al método del servicio para desactivar el área
      this.subareaService.desactivarSubArea(id, subarea).pipe(
        tap(() => {
          // Manejo de la respuesta
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La sub-área se ha desactivado correctamente.',
            confirmButtonText: 'Aceptar'
          });
          // Actualizar la lista de áreas después de desactivar
          this.cargarSubArea();
        }),
        catchError((error) => {
          // Manejo de errores
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al desactivar la sub-área.',
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

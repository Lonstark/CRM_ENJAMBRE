import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Area } from 'src/app/models/Area/area.model';
import { AreaService } from 'src/app/services/Area/area.service';
import * as $ from 'jquery';
import 'select2';
import Swal from 'sweetalert2';
import { Subarea } from 'src/app/models/SubArea/subarea.model';
import { SubareaService } from 'src/app/services/SubArea/subarea.service';

@Component({
  selector: 'app-update-subarea',
  templateUrl: './update-subarea.component.html',
  styleUrls: ['./update-subarea.component.css']
})
export class UpdateSubareaComponent implements OnInit, AfterViewInit {
  subarea: Subarea = new Subarea();
  areas: Area[] = [];

  idAreaSeleccionada: number = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateSubareaComponent>,
    private areaService: AreaService,
    private subareaService: SubareaService
  ) {
    this.subarea = this.data.subArea;
    this.idAreaSeleccionada = this.data.idAreaSeleccionada;
    console.log(this.idAreaSeleccionada);
    //console.log(this.subarea);
  }

  ngOnInit(): void {
    this.cargarAreas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#areas').select2();

    setTimeout(() => {
      
      if (this.idAreaSeleccionada !== 0) {
        $('#areas').val(this.idAreaSeleccionada.toString()).trigger('change');
      }
    }, 50); 

    $('#areas').on('change', () => {
  
      this.idAreaSeleccionada = parseInt($('#areas').val(), 10);
      console.log(this.idAreaSeleccionada);
    });
  }

  onEditar(): void {
    if (!this.subarea.nombre || this.subarea.nombre.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }

    if (!this.subarea.descripcion || this.subarea.descripcion.trim() === '') {
      console.log("Ingrese la descripcion");
      return;
    }

    if (!this.subarea.descripcion || this.subarea.descripcion.trim() === '') {
      console.log("Ingrese la descripcion");
      return;
    }

    if (!this.idAreaSeleccionada || this.idAreaSeleccionada === 0) {
      console.log("Seleccione un área");
      return;
    } else {
      if (!this.subarea.area) {
        this.subarea.area = new Area();
      }
      this.subarea.area.idArea = this.idAreaSeleccionada;
    }

    // Registrar Subárea
    this.subareaService.registrarSubArea(this.subarea).subscribe({
      next: (subareaRegistrado) => {
        console.log('Subárea Actualizada con éxito:', subareaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Subárea Actualizada',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al actualizar Subárea:', error);
      }
    } as Observer<Subarea>);
  }

  private cargarAreas(): void {
    const observer: Observer<Area[]> = {
      next: (data) => {
        this.areas = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener las áreas:', error);
      },
      complete: () => {
      },
    };

    this.areaService.getAreas().subscribe(observer);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
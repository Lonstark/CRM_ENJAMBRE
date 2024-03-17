import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Area } from 'src/app/models/Area/area.model';
import { AreaService } from 'src/app/services/Area/area.service';
import * as $ from 'jquery';
import 'select2';
import Swal from 'sweetalert2';
import { Subarea } from 'src/app/models/SubArea/subarea.model';
import { SubareaService } from 'src/app/services/SubArea/subarea.service';

@Component({
  selector: 'app-create-subarea',
  templateUrl: './create-subarea.component.html',
  styleUrls: ['./create-subarea.component.css']
})
export class CreateSubareaComponent implements OnInit , AfterViewInit {

  subarea: Subarea = {
    estado: 0
  }
  areas: Area[] = [];
  idAreaSeleccionada: number = 0
  ;
  constructor(
    public dialogRef: MatDialogRef<CreateSubareaComponent>,
    private areaService: AreaService,
    private subareaService: SubareaService
  ) { }

  ngOnInit(): void {
    this.cargarAreas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    const self = this; // Guarda una referencia al componente para acceder a 'subarea'
    $('#areas').select2();
    $('#areas').val('0').trigger('change');
    $('#areas').on('change', (event: any) => {
      this.idAreaSeleccionada = $(event.target).val();
      console.log(this.idAreaSeleccionada)
    });
  }

  onRegistrar(): void {
    if (!this.subarea.nombre || this.subarea.nombre.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }

    if (!this.subarea.descripcion || this.subarea.descripcion.trim() === '') {
      console.log("Ingrese la descripcion");
      return;
    }

    if (!this.subarea.estado || this.subarea.estado === 0) {
      console.log("Seleccione el estado");
      return;
    }

    if (!this.idAreaSeleccionada || this.idAreaSeleccionada === 0) {
      console.log("Seleccione un área");
      return;
    }else{
      if (!this.subarea.area) {
        this.subarea.area = new Area();
      }
      this.subarea.area.idArea = this.idAreaSeleccionada;
    }

    // Registrar Subárea
    this.subareaService.registrarSubArea(this.subarea).subscribe({
      next: (subareaRegistrado) => {
        console.log('Subárea registrada con éxito:', subareaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Subárea registrado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar Subárea:', error);
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
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Area } from 'src/app/models/Area/area.model';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { AreaService } from 'src/app/services/Area/area.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import 'select2';

@Component({
  selector: 'app-update-area',
  templateUrl: './update-area.component.html',
  styleUrls: ['./update-area.component.css']
})
export class UpdateAreaComponent implements OnInit, AfterViewInit {
  area: Area = new Area();
  empresasSeleccionadas: number[] = [];
  empresas: Empresa[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<UpdateAreaComponent>,
    private empresaService: EmpresaService,private areaService: AreaService,) { 
      this.area = this.data.area;
      this.empresasSeleccionadas = this.data.empresasSeleccionadas;
    }
  ngOnInit(): void {
    this.cargarEmpresas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#empresas').select2();
    $('#estado').select2();
  
    // Obtener los IDs de las empresas seleccionadas como arreglo de strings
    const empresasSeleccionadasStrings = this.empresasSeleccionadas.map(String);
    console.log(empresasSeleccionadasStrings);
  
    // Esperar un breve momento para asegurarse de que las opciones se hayan cargado completamente
    setTimeout(() => {
      // Establecer las opciones seleccionadas en el control select2 solo si hay empresas seleccionadas
      if (empresasSeleccionadasStrings.length > 0) {
        $('#empresas').val(empresasSeleccionadasStrings).trigger('change');
      }
  
      // Verificar si this.area.estado está definido antes de intentar acceder a sus propiedades
      if (this.area.estado !== undefined) {
        // Establecer el valor del estado
        $('#estado').val(this.area.estado.toString()).trigger('change');
      } else {
        console.error("El estado de this.area es undefined");
      }
    }, 50); // Esperar 50 milisegundos
  
    // Suscribirse al evento de cambio del control select2 para las empresas
    $('#empresas').on('change', () => {
      // Obtener los IDs de las empresas seleccionadas y actualizar la lista
      this.empresasSeleccionadas = $('#empresas').val().map(Number);
      console.log(this.empresasSeleccionadas);
    });
  
    // Suscribirse al evento de cambio del control select2 para el estado
    $('#estado').on('change', () => {
      // Obtener el valor seleccionado para el estado y actualizar el área
      if (this.area.estado !== undefined) {
        this.area.estado = parseInt($('#estado').val(), 10);
        console.log(this.area.estado);
      }
    });
  }
  
  private cargarEmpresas(): void {
    const observer: Observer<Empresa[]> = {
      next: (data) => {
        this.empresas = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };

    this.empresaService.getEmpresas().subscribe(observer);
  }

  onEditar(): void {
    if (!this.area.nombre || this.area.nombre.trim() === '') {
      console.log("Ingrese el nombre");
      return;
    }
  
    if (!this.area.descripcion || this.area.descripcion.trim() === '') {
      console.log("Ingrese la descripcion");
      return;
    }
  
    if (this.empresasSeleccionadas.length > 0) {
      // Asignar los IDs de las empresas seleccionadas al área
      this.area.empresas = this.empresasSeleccionadas.map(id => ({ idEmpresa: id }));
    } else {
      console.error('No se han seleccionado empresas.');
      return;
    }
    
    // Registrar Area
    this.areaService.registrarArea(this.area).subscribe({
      next: (areaRegistrado) => {
        console.log('Área actualizada con éxito:', areaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Area actualizada',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar area:', error);
      }
    } as Observer<Area>);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

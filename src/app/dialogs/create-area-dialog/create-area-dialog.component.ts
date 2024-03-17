import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Area } from 'src/app/models/Area/area.model';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { AreaService } from 'src/app/services/Area/area.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import * as $ from 'jquery';
import 'select2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-area-dialog',
  templateUrl: './create-area-dialog.component.html',
  styleUrls: ['./create-area-dialog.component.css']
})
export class CreateAreaDialogComponent implements OnInit , AfterViewInit {

  area: Area = new Area();
  empresasSeleccionadas: number[] = [];
  empresas: Empresa[] = [];
  errorNombre: boolean = false;
  errorDescripcion: boolean = false;
  estadoSeleccionado: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CreateAreaDialogComponent>,
    private areaService: AreaService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  initializeSelect2() {
    $('#empresas').select2();
     $('#empresas').on('change', (event: any) => {
      this.empresasSeleccionadas = $(event.target).val();
      console.log(this.empresasSeleccionadas)
    });
    $('#estado').select2();
    $('#estado').val('0').trigger('change');
    $('#estado').on('change', (event: any) => {
       this.estadoSeleccionado = $(event.target).val();
      console.log('Estado seleccionado:', this.estadoSeleccionado);
    });
  }

  onRegistrar(): void {
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
    
    if(this.estadoSeleccionado === null || this.estadoSeleccionado  === 0){
      console.error('No se han seleccionado estado.');
      return;    
    }else{
      this.area.estado = this.estadoSeleccionado
    }

    // Registrar Area
    this.areaService.registrarArea(this.area).subscribe({
      next: (areaRegistrado) => {
        console.log('Área registrado con éxito:', areaRegistrado);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          title: 'Area registrado',
          showConfirmButton: true,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar documento:', error);
      }
    } as Observer<Area>);
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

    this.empresaService.getActiveEmpresas().subscribe(observer);
  }



  onClose(): void {
    this.dialogRef.close();
  }

}
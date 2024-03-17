import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ViewChildren, QueryList } from '@angular/core';
import * as $ from 'jquery';
import 'select2';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit, AfterViewInit{
  certificados: any[] = [];
  constructor(public dialogRef: MatDialogRef<CreateSaleComponent>) { }

  
  ngOnInit(): void {
    // No es necesario inicializar los select2 aquí
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  initializeSelect2() {
    // Inicializar select2 en todas las pestañas
    $('#selectEmpresa').select2();
    $('#selectEmpresa').val('0').trigger('change');

    $('#selectGender').select2();
    $('#selectGender').val('0').trigger('change');

    $('#selectDocument').select2();
    $('#selectDocument').val('0').trigger('change');

    $('#selectCountry').select2();
    $('#selectCountry').val('0').trigger('change');

    $('#selectDepartamento').select2();
    $('#selectDepartamento').val('0').trigger('change');
    
    $('#selectProvincia').select2();
    $('#selectProvincia').val('0').trigger('change');

    $('#selectDistrito').select2();
    $('#selectDistrito').val('0').trigger('change');

    $('#selectCivil').select2();
    $('#selectCivil').val('0').trigger('change');

    $('#selectBanco').select2();
    $('#selectBanco').val('0').trigger('change');

    $('#selectTipoCuenta').select2();
    $('#selectTipoCuenta').val('0').trigger('change');

    $('#selectMoneda').select2();
    $('#selectMoneda').val('0').trigger('change');

    $('#selectPerfil').select2(); 

    $('#selectZona').select2();
    $('#selectArea').select2();
    $('#selectSubArea').select2();
  }
  
  agregarCertificado() {
    this.certificados.push({
      certificado: '',
      fechaInicio: '',
      fechaFin: '',
      vigente: null
    });
  }

  eliminarCertificado(index: number) {
    this.certificados.splice(index, 1);
  }

  validarVigencia(certificado: any) {
    if (certificado.fechaInicio && certificado.fechaFin) {
      const hoy = new Date();
      const inicio = new Date(certificado.fechaInicio);
      const fin = new Date(certificado.fechaFin);
      certificado.vigente = inicio <= hoy && hoy <= fin;
    } else {
      certificado.vigente = false;
    }
  }
}

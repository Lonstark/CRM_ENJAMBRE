import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Perfil } from 'src/app/models/Perfil/perfil.model';
import { CreateUserComponent } from 'src/app/dialogs/create-user/create-user.component';
import Swal from 'sweetalert2';
import { Venta } from 'src/app/models/Venta/venta';
import { MatSort } from '@angular/material/sort';
import { CreateSaleComponent } from 'src/app/dialogs/create-sale/create-sale.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements AfterViewInit,OnInit{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  
  displayedColumns: string[] = ['position', 'usuario','certificado','tipoVenta','cliente','direccion','documento','email','actions'];

  dataSource = new MatTableDataSource<Venta>();
  
  constructor(public dialog: MatDialog,){}
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.page.subscribe(() => {
      //this.cargarAcciones();
      });
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit(): void {
    
  }

  openNuevaVenta(): void {
    const dialogRef = this.dialog.open(CreateSaleComponent, {
      width: '90%',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
    });
  }

}

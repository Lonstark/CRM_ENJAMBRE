import { Component, OnInit } from '@angular/core';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientDialogComponent } from 'src/app/dialogs/create-client-dialog/create-client-dialog.component';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { Observer, Subscription } from 'rxjs';
import { Empresa } from 'src/app/models/Empresa/empresa.model';
import { Cliente } from 'src/app/models/Cliente/cliente.model';
import { Perfil } from 'src/app/models/Perfil/perfil.model';
import { PerfilService } from 'src/app/services/Perfil/perfil.service';
import { CreateProfileComponent } from 'src/app/dialogs/create-profile/create-profile.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit, OnInit{

  displayedColumns: string[] = ['position', 'name','status','actions'];
  dataSource = new MatTableDataSource<Perfil>();

  perfiles: Perfil[] = [];


  constructor(
    public dialog: MatDialog,
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
    this.cargarPerfiles();
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

  openNuevoPerfil(): void {
    const dialogRef = this.dialog.open(CreateProfileComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      this.cargarPerfiles();
    });
  }

  private cargarPerfiles(): void {
    const observer: Observer<Perfil[]> = {
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener las empresas:', error);
      },
      complete: () => {
      },
    };
    this.perfilService.getPerfiles().subscribe(observer);
  }

  





}


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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit,OnInit{
  displayedColumns: string[] = ['position', 'name','lastname','t-document','document','perfil','status','actions'];
  dataSource = new MatTableDataSource<Usuario>();
  usuarios: Usuario[] = []

  constructor(
    public dialog: MatDialog,
    private usuarioService:UsuarioService
    ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  openNuevoUsuario(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '90%',
      // Aquí puedes agregar otras opciones de configuración del diálogo, como el tamaño, la posición, etc.
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
      // Aquí puedes realizar acciones después de que el diálogo se haya cerrado, si es necesario
    });
  }


  private cargarUsuarios(): void {
    const observer: Observer<Usuario[]> = {
      next: (data) => {
        this.usuarios = data;
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error al obtener las Areas:', error);
      },
      complete: () => {
        console.log("Se cargaron las Areas")
      },
    };

    this.usuarioService.getUsuarios().subscribe(observer);
  }

  getPerfilesAsString(perfiles: Perfil[]): string {
    if (!perfiles || perfiles.length === 0) {
      return '';
    }
    return perfiles.map(p => p.nombre).join(', ');
  }

  confirmarEliminacion(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes llamar a tu función para eliminar el usuario
        // this.eliminarUsuario(); 
        Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
      }
    });
  }
}


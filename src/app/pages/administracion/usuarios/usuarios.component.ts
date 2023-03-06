import { Component, OnInit, OnDestroy } from '@angular/core';

import { Usuario } from './../../../models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from './../../../services/busquedas.service';
import { SweetAlertService } from './../../../services/sweet-alert.service';
import { ModalImagenService } from './../../../services/modal-imagen.service';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  constructor(
    private _usuarioService: UsuarioService,
    private _busquedaService: BusquedasService,
    private _swal: SweetAlertService,
    private _modalService: ModalImagenService
  ) { }

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public loading: boolean = true;
  public imgSubs: Subscription;

  ngOnInit(): void {
    this.getUsuarios();

    // Suscribirse a un EventEmitter
    this.imgSubs = this._modalService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.getUsuarios();
      });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  getUsuarios() {
    this.loading = true;
    this._usuarioService.getUsuarios(this.desde)
      .subscribe((res: any) => {
        this.totalUsuarios = res.total;
        this.usuarios = res.usuarios;
        this.usuariosTemp = res.usuarios;
        this.loading = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.getUsuarios();
  }


  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this._busquedaService.buscar('usuarios', termino)
      .subscribe((resultados: Usuario[]) => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this._usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrar su propio usuario.', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar al usuario ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.deleteUsuario(usuario)
          .subscribe(res => {
            this.getUsuarios();
            Swal.fire('Usuario Borrado', `${usuario.nombre} fue eliminado correctamente.`, 'success');
          });
      }
    })
  }

  cambiarRole(usuario: Usuario) {
    this._usuarioService.updateRole(usuario)
      .subscribe(res => {
        this._swal.Toast.fire({
          icon: 'success',
          title: `Se ha modificado el rol de ${usuario.nombre}`
        });
      })
  }

  abrirModal(usuario: Usuario) {
    this._modalService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}

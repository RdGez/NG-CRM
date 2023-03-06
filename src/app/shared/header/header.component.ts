import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from './../../models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  constructor(
    private _usuarioService: UsuarioService,
    private _route: Router
    ) {
    this.usuario = _usuarioService.usuario;
  }

  public usuario: Usuario;

  logout() {
    this._usuarioService.logout();
  }

  buscar(termino: string){
    if(termino.length === 0){
      return this._route.navigateByUrl('/dashboard');
    }

    this._route.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}

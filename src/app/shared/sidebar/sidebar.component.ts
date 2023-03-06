import { Component } from '@angular/core';

import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

import { Usuario } from './../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  menuItems: any[];

  constructor( public sidebarService: SidebarService, private _usuarioService: UsuarioService ) {
    this.usuario = _usuarioService.usuario;
  }

  public usuario: Usuario;

}

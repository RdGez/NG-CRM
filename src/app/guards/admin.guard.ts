import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UsuarioService } from './../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private _usuarioService: UsuarioService, private _router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
      // return (this._usuarioService.role === 'ADMIN_ROLE') ? true : false;
      if (this._usuarioService.role === 'ADMIN_ROLE') {
        return true;
      } else {
        this._router.navigateByUrl('/dashboard');
        return false;
      }
  }
  
}

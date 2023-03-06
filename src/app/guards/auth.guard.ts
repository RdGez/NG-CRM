import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private _usuarioService: UsuarioService, private router: Router) { }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._usuarioService.validarToken().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('login');
        }
      })
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this._usuarioService.validarToken().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('login');
        }
      })
    );
  }
}

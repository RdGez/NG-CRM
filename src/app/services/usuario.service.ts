import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { Router } from '@angular/router';

import { RegisterForm } from './../interfaces/register-form.interface';
import { LoginForm } from './../interfaces/login-form.interface';

import { environment } from '../../environments/environment';
import { Usuario } from './../models/usuario.model';

const _url = environment._url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.googleInit();
  }

  public auth2: any;
  public usuario: Usuario;

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  get role(): string {
    return this.usuario.role;
  }

  guardarStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  googleInit() {
    return new Promise((resolve: any) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '581855671142-bvij9rf9cvovga0ng8fataenpfi8rd8t.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  login(formData: LoginForm) {
    return this._http.post(`${_url}/auth`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarStorage(res.token, res.menu);
        })
      );
  }

  loginGoogle(token) {
    return this._http.post(`${_url}/auth/google`, { token })
      .pipe(
        tap((res: any) => {
          this.guardarStorage(res.token, res.menu);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    })
  }

  validarToken(): Observable<boolean> {
    return this._http.get(`${_url}/auth/renew`, {
      headers: { 'x-token': this.token }
    }).pipe(
      map((res: any) => {
        this.guardarStorage(res.token, res.menu);

        // Guardar datos del usuario
        const { email, google, img = '', nombre, role, uid } = res.usuario
        this.usuario = new Usuario(nombre, email, '', uid, img, role, google);

        return true;
      }),
      catchError(error => of(false))
    );
  }

  addUsuario(formData: RegisterForm) {
    return this._http.post(`${_url}/usuarios/add`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarStorage(res.token, res.menu);
        })
      );
  }

  updateProfile(data: { email: string, nombre: string, role: string }) {
    data = { ...data, role: this.usuario.role }
    return this._http.put(`${_url}/usuarios/update/${this.uid}`, data, this.headers);
  }

  updateRole(usuario: Usuario) {
    return this._http.put(`${_url}/usuarios/update/${usuario.uid}`, usuario, this.headers);
  }

  getUsuarios(desde: number = 0) {
    return this._http.get(`${_url}/usuarios?desde=${desde}`, this.headers).
      pipe(
        delay(
          500
        ),
        map((res: any) => {
          const usuarios = res.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.uid, user.img, user.role, user.google));
          return { total: res.total, usuarios };
        })
      );
  }

  deleteUsuario(usuario: Usuario) {
    return this._http.delete(`${_url}/usuarios/delete/${usuario.uid}`, this.headers);
  }

}
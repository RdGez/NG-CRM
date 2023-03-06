import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { Usuario } from './../models/usuario.model';
import { Hospital } from './../models/hospital.mode';
import { Medico } from './../models/medico.model';

const _url = environment._url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private _http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.uid, user.img, user.role, user.google)
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[]{
    return resultados;
  }

  private transformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }

  buscarGlobal(termino: string){
    return this._http.get<any>(`${_url}/search/${termino}`, this.headers)
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this._http.get<any>(`${_url}/search/${tipo}/${termino}`, this.headers)
      .pipe(
        map((res: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(res.resultados);
              break;
            case 'medicos':
              return this.transformarMedicos(res.resultados);
              break;
            case 'hospitales':
              return this.transformarHospitales(res.resultados);
              break;
            default:
              break;
          }
        })
      );
  }
}

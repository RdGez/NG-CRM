import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Medico } from './../models/medico.model';

import { environment } from './../../environments/environment.prod';

const _url = environment._url;

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(private _http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  getMedicos() {
    return this._http.get(`${_url}/medicos`, this.headers)
      .pipe(
        map((res: { ok: boolean, medicos: Medico[] }) => res.medicos)
      );
  }

  getMedicoById(id: string){
    return this._http.get(`${_url}/medicos/${id}`, this.headers)
      .pipe(
        map((res: { ok: boolean, medico: Medico }) => res.medico)
      );
  }

  addMedico(medico: {nombre: string, hospital: string}) {
    return this._http.post(`${_url}/medicos/add`, medico, this.headers);
  }

  updateMedico(medico: Medico) {
    return this._http.put(`${_url}/medicos/update/${medico.uid}`, medico, this.headers);
  }

  deleteMedico(uid: string) {
    return this._http.delete(`${_url}/medicos/delete/${uid}`, this.headers);
  }
}

import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Hospital } from './../models/hospital.mode';

const _url = environment._url;

@Injectable({
  providedIn: 'root'
})
export class HospitalesService {

  constructor(
    private _http: HttpClient,
    private router: Router
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } }
  }

  getHospitales() {
    return this._http.get(`${_url}/hospitales`, this.headers)
      .pipe(
        map((res: { ok: boolean, hospitales: Hospital[] }) => res.hospitales)
      );
  }

  addHospital(nombre: string) {
    return this._http.post(`${_url}/hospitales/add`, { nombre }, this.headers);
  }

  updateHospital(_id: string, nombre: string) {
    return this._http.put(`${_url}/hospitales/update/${_id}`, { nombre }, this.headers);
  }

  deleteHospital(_id: string) {
    return this._http.delete(`${_url}/hospitales/delete/${_id}`, this.headers);
  }
}

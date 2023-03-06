import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Usuario } from './../../models/usuario.model';
import { Medico } from './../../models/medico.model';
import { Hospital } from './../../models/hospital.mode';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _busquedaService: BusquedasService
  ) { }

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  ngOnInit(): void {
    this._activatedRoute.params
      .subscribe(({ termino }) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string) {
    this._busquedaService.buscarGlobal(termino)
      .subscribe((res) => {
        this.usuarios = res.usuarios;
        this.medicos = res.medicos;
        this.hospitales = res.hospitales;
      });
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from './../../../models/medico.model';

import { MedicosService } from './../../../services/medicos.service';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { SweetAlertService } from './../../../services/sweet-alert.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  constructor(
    private _medicosService: MedicosService,
    private _modalService: ModalImagenService,
    private _busquedaService: BusquedasService,
    private _swal: SweetAlertService
  ) { }

  public medicos: Medico[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;

  ngOnInit(): void {
    this.getMedicos();

    this.imgSubs = this._modalService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.getMedicos();
      })
  };

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getMedicos();
    }
    this._busquedaService.buscar('medicos', termino)
      .subscribe(resultados => {
        this.medicos = resultados;
      });
  }

  abrirModal(medico: Medico) {
    console.log(medico);
    this._modalService.abrirModal('medicos', medico.uid, medico.img);
  }

  getMedicos() {
    this.loading = true;

    this._medicosService.getMedicos()
      .pipe(
        delay(500)
      )
      .subscribe(medicos => {
        this.loading = false;
        this.medicos = medicos;
      });
  }

  eliminarMedico(medico: Medico) {

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar al medico ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._medicosService.deleteMedico(medico.uid)
          .subscribe(res => {
            this.getMedicos();
            this._swal.Toast.fire({ icon: 'success', title: 'Se ha eliminado correctamente' });
          }, err => {
            this._swal.Toast.fire({ icon: 'error', title: 'No se ha podido eliminar' });
          })
      }
    })
  }

}

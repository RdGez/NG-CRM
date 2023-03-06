import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Hospital } from './../../../models/hospital.mode';
import { HospitalesService } from './../../../services/hospitales.service';
import { SweetAlertService } from './../../../services/sweet-alert.service';

import Swal from 'sweetalert2';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { BusquedasService } from './../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  constructor(
    private _hospitalService: HospitalesService,
    private _swal: SweetAlertService,
    private _modalImagenService: ModalImagenService,
    private _busquedaService: BusquedasService
  ) { }

  public hospitales: Hospital[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;

  ngOnInit(): void {
    this.getHospitales();

    this.imgSubs = this._modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.getHospitales();
      });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.getHospitales();
    }
    this._busquedaService.buscar('hospitales', termino)
      .subscribe(resultados => {
        this.hospitales = resultados;
      });
  }

  getHospitales() {
    this.loading = true;

    this._hospitalService.getHospitales()
      .pipe(
        delay(500)
      )
      .subscribe(hospitales => {
        this.loading = false;
        this.hospitales = hospitales;
      });
  }

  guardarCambios(hospital: Hospital) {
    this._hospitalService.updateHospital(hospital._id, hospital.nombre)
      .subscribe(res => {
        this._swal.Toast.fire({ icon: 'success', title: 'Se ha modificado correctamente' });
      }, err => {
        this._swal.Toast.fire({ icon: 'error', title: 'No se ha podido modificar' });
      })
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Esta a punto de borrar al hosptail ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._hospitalService.deleteHospital(hospital._id)
          .subscribe(res => {
            this.getHospitales();
            this._swal.Toast.fire({ icon: 'success', title: 'Se ha eliminado correctamente' });
          }, err => {
            this._swal.Toast.fire({ icon: 'error', title: 'No se ha podido eliminar' });
          })
      }
    })
  }

  async abrilSwal() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Agregar Hospital',
      input: 'text',
      inputLabel: 'Ingrese nombre del nuevo hospital:',
      showCancelButton: true,

    })

    if (value.trim().length > 0) {
      this._hospitalService.addHospital(value)
        .subscribe((res: any) => {
          this.hospitales.push(res.hospital);
          this._swal.Toast.fire({ icon: 'success', title: 'Se ha agregado correctamente' });
        }, err => {
          this._swal.Toast.fire({ icon: 'error', title: 'No se ha podido agregar' });
        })
    }
  }

  abrirModal(hospital: Hospital) {
    this._modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}

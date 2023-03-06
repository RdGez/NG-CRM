import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { HospitalesService } from 'src/app/services/hospitales.service';
import { MedicosService } from 'src/app/services/medicos.service';

import { Hospital } from './../../../models/hospital.mode';
import { Medico } from './../../../models/medico.model';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _hospitalService: HospitalesService,
    private _medicoService: MedicosService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute // Para obtener parametros de una ruta aunque no cambie.
  ) { }

  public medicoForm: FormGroup;
  public hospitales: Hospital[];
  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ id }) => {
      this.getMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.getHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
      });
  }

  getHospitales() {
    this._hospitalService.getHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  getMedico(id: string) {
    if (id === 'add') {
      return;
    }

    this._medicoService.getMedicoById(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico => {
        const { nombre, hospital: { _id } } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      }, err => {
        return this._route.navigateByUrl(`/dashboard/medicos`);
      });
  }

  guardarMedico() {
    if (!this.medicoSeleccionado) {
      this._medicoService.addMedico(this.medicoForm.value)
        .subscribe((res: any) => {
          Swal.fire('Registrado', `El medico ${res.medico.nombre} ha sido registrado`, 'success')
            .then((result) => {
              if (result.isConfirmed) {
                this._route.navigateByUrl('/dashboard/medicos');
              }
            });
        }, err => {
          console.log(err);
          Swal.fire('Error', `No se ha podido registrar al medico ${this.medicoForm.get('nombre').value}`, 'error');
        });
    } else {
      const data = { uid: this.medicoSeleccionado.uid, ...this.medicoForm.value };

      this._medicoService.updateMedico(data)
        .subscribe((res: any) => {
          Swal.fire('Modificado', `El medico ${this.medicoForm.get('nombre').value} ha sido registrado`, 'success')
            .then((result) => {
              if (result.isConfirmed) {
                this._route.navigateByUrl('/dashboard/medicos');
              }
            });
        }, err => {
          console.log(err);
          Swal.fire('Error', `No se ha podido registrar al medico ${this.medicoForm.get('nombre').value}`, 'error');
        });
    }
  }

}

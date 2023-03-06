import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from './../../services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private fb: FormBuilder, private _usuarioService: UsuarioService, private router: Router) { }

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Oscar A.', [Validators.required, Validators.minLength(3)]],
    email: ['OscarRodriguezViveros@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    passwordVerify: ['123456', Validators.required],
    terminos: [true, Validators.required],
  }, {
    validators: this.passwordIguales('password', 'passwordVerify')
  });

  registrarUsuario() {
    this.formSubmitted = true;

    const email = this.registerForm.get('email').value.toLowerCase();
    this.registerForm.get('email').setValue(email);


    if (this.registerForm.invalid) {
      return
    }

    // Realizar el registro:
    this._usuarioService.addUsuario(this.registerForm.value)
      .subscribe(res => {
        // Navegar al dashboard.
        this.router.navigateByUrl('/');
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  campoIncorrecto(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptarTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  validacionContrasena() {
    const pass = this.registerForm.get('password').value;
    const passVerify = this.registerForm.get('passwordVerify').value;

    if ((pass !== passVerify) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.get(pass1);
      const passVerify = formGroup.get(pass2);

      if (passControl.value === passVerify.value) {
        passVerify.setErrors(null);
      } else {
        passVerify.setErrors({ equals: true });
      }
    }
  }

}

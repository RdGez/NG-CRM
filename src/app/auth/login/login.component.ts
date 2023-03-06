import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.renderButton();
  }

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  login() {
    const email = this.loginForm.get('email').value.toLowerCase();
    this.loginForm.get('email').setValue(email);

    // Hacer la peticion.
    this._usuarioService.login(this.loginForm.value)
      .subscribe(res => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }

        // Navegar al dashboard.
        this.router.navigateByUrl('/');
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  // Funciones necesarias para el inicio de sesión de google.
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

  async startApp() {
    await this._usuarioService.googleInit();
    this.auth2 = this._usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      googleUser => {
        const id_token = googleUser.getAuthResponse().id_token;
        this._usuarioService.loginGoogle(id_token)
          .subscribe(res => {
            this.ngZone.run(() => {
              // Navegar al dashboard.
              this.router.navigateByUrl('/');
            });
          });
      }, (error) => {
        console.warn(JSON.stringify(error, undefined, 2));
      });
  }


}

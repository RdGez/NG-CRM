import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Usuario } from './../../models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from './../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _fileUpload: FileUploadService
  ) {
    this.usuario = _usuarioService.usuario;
  }

  public profileForm: FormGroup;
  public usuario: Usuario;
  public imgUpload: File;
  public imgTemp: any = null;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this._usuarioService.updateProfile(this.profileForm.value)
      .subscribe(res => {
        const { nombre, email } = this.profileForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Actualiado', 'Los datos han sido actualizados.', 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  actualizarAvatar(file: File) {
    this.imgUpload = file;

    if (!file) { return this.imgTemp = null; }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  uploadImage() {
    this._fileUpload.actualizarAvatar(this.imgUpload, 'usuarios', this.usuario.uid)
      .then(file => { 
        this.usuario.img = file 

        Swal.fire('Actualizado', 'Imagen de Perfil actualizada.', 'success');
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'Imagen de Perfil actualizada.', 'error');
      });
  }

}

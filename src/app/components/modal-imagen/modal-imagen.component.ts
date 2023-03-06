import { Component, OnInit } from '@angular/core';

import { ModalImagenService } from './../../services/modal-imagen.service';
import { FileUploadService } from './../../services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  constructor(public modalService: ModalImagenService, public _fileUpload: FileUploadService) { }

  public imgUpload: File;
  public imgTemp: any = null;

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalService.cerrarModal();
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

    const id = this.modalService.id;
    const tipo = this.modalService.tipo;

    this._fileUpload.actualizarAvatar(this.imgUpload, tipo, id)
      .then(file => { 
        Swal.fire('Actualizado', 'Imagen de Perfil actualizada.', 'success');
        
        this.modalService.nuevaImagen.emit(file);
        this.cerrarModal();
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'Imagen de Perfil actualizada.', 'error');
      });
  }

}

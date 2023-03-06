import { Injectable, EventEmitter } from '@angular/core';
import { environment } from './../../environments/environment';

const _url = environment._url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  constructor() { }

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();
  
  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios' | 'medicos' | 'hospitales', id: string, img: string = 'no-img'){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;

    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${_url}/upload/${tipo}/${img}`;
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

import { environment } from './../../environments/environment';

const _url = environment._url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {
    if (!img) {
      return `${_url}/upload/${tipo}/no-image`;
    } else if (img.includes('http')) {
      return img;
    } else if (img) {
      return `${_url}/upload/${tipo}/${img}`;
    } else {
      return `${_url}/upload/${tipo}/no-image`;
    }
  }

}

import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

const _url = environment._url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarAvatar(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {

    try {
      const url = `${_url}/upload/${tipo}/${id}`;
      const formData = new FormData();

      formData.append('archivo', archivo);

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await res.json();
      
      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

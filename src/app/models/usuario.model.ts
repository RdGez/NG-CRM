import { environment } from './../../environments/environment';

const _url = environment._url;

export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public uid?: string,
        public img?: string,
        public role?: string,
        public google?: boolean,
    ) { }

    get ProfilePicture() {
        if (!this.img) {
            return `${_url}/upload/usuarios/no-image`;
        } else if (this.img.includes('http')) {
            return this.img;
        } else if (this.img) {
            return `${_url}/upload/usuarios/${this.img}`;
        } else {
            return `${_url}/upload/usuarios/no-image`;
        }
    }
}
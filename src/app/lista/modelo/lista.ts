import { Cancion } from "./cancion";

export class Lista {
    idLista: number;
    nombre: string;
    descripcion: string;
    canciones: Cancion[];
    constructor() {
        this.idLista = 0;
        this.nombre = '';
        this.descripcion = '';
        this.canciones = [];
    }
}

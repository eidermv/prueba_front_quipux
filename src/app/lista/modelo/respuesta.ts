export class Respuesta {
  idLista: number;
  error: number;
  mensaje: string;

  constructor() {
    this.idLista = 0;
    this.error = -100;
    this.mensaje = 'Esperando respuesta';
  }

}

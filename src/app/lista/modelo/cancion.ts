export class Cancion {
  idCancion: number;
  titulo: string;
  artista: string;
  album: string;
  genero: string;
  anno: number;

  constructor() {
    this.idCancion = 0;
    this.titulo = '';
    this.artista = '';
    this.album = '';
    this.genero = '';
    this.anno = 0;
  }
}

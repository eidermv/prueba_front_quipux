import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Respuesta } from '../modelo/respuesta';
import { Lista } from '../modelo/lista';
import { Cancion } from "../modelo/cancion";

@Injectable({
  providedIn: 'root'
})
export class ListaContenedorService {

  public listas = new BehaviorSubject<Lista[]>([]);
  public cancionesLista = new BehaviorSubject<Cancion[]>([]);
  public generos = new BehaviorSubject<string[]>([]);


  public resultadoInsert = new BehaviorSubject(new Respuesta());

  constructor() { }
}

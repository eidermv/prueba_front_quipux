import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Validacion } from "../../../login/modelo/validacion";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, ReplaySubject } from "rxjs";
import { ListaService } from "../../servicios/lista.service";
import { ListaContenedorService } from "../../servicios/lista-contenedor.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { takeUntil } from "rxjs/operators";
import { Cancion } from "../../modelo/cancion";

@Component({
  selector: 'app-crear-lista-canciones',
  templateUrl: './crear-lista-canciones.component.html',
  styleUrls: ['./crear-lista-canciones.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CrearListaCancionesComponent implements OnInit, OnDestroy, AfterViewInit {

  /*
  "titulo": "nueva",
"artista": "otro",
"album": "",
"anno": 2020,
"genero": "Merengue"
   */
  generos: Observable<string[]>;

  public errorTitulo: Validacion[] = [
    {tipo: 'required', msn: 'Titulo es requerido'}
  ];

  public errorArtista: Validacion[] = [
    //{tipo: 'required', msn: 'Artista es requerido'}
  ];

  public errorAlbum: Validacion[] = [
    //{tipo: 'required', msn: 'Album es requerido'}
  ];

  public errorAnio: Validacion[] = [
    //{tipo: 'required', msn: 'Descripcion es requerido'}
  ];

  public errorGenero: Validacion[] = [
    {tipo: 'required', msn: 'Genero es requerido'}
  ];

  public mnsErrorTitulo = '';
  public mnsErrorArtista = '';
  public mnsErrorAlbum = '';
  public mnsErrorAnio = '';
  public mnsErrorGenero = '';


  public controls = {
    titulo: new FormControl('', [Validators.required]),
    artista: new FormControl('', []),
    album: new FormControl('', []),
    anio: new FormControl('', []),
    genero: new FormControl('', [Validators.required])
  };

  public formGroup: FormGroup;

  private subs: ReplaySubject<void> = new ReplaySubject();

  @Output('listaCanciones') evento = new EventEmitter<Cancion[]>();

  private canciones: Cancion[] = [];

  constructor(
    private fb: FormBuilder,
    private servicio: ListaService,
    private contenedor: ListaContenedorService
  ) { }

  ngOnInit(): void {
    this.servicio.listarGeneros();
    this.generos = this.contenedor.generos.asObservable();

    this.formGroup = this.fb.group({
      titulo: this.controls.titulo,
      artista: this.controls.artista,
      album: this.controls.album,
      anio: this.controls.anio,
      genero: this.controls.genero
    });
  }

  guardar(): void {
    if (this.formGroup.valid) {

      const cancion: Cancion = new Cancion();
      cancion.titulo =  typeof this.controls.titulo.value === "string" ? this.controls.titulo.value :'';
      cancion.artista =  typeof this.controls.artista.value === "string" ? this.controls.artista.value :'';
      cancion.album =  typeof this.controls.album.value === "string" ? this.controls.album.value :'';
      cancion.anno =  typeof this.controls.anio.value === "string" ? Number(this.controls.anio.value) :0;
      cancion.genero =  typeof this.controls.genero.value === "string" ? this.controls.genero.value :'';

      this.canciones.push(cancion);
      this.evento.emit(this.canciones)

      this.formGroup.reset();
    }
  }

  ngAfterViewInit(): void {
    console.log('entra a after view');
    this.controls.titulo.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorTitulo.forEach((error) => {
          if (this.controls.titulo.hasError(error.tipo)) {
            this.mnsErrorTitulo = error.msn;
          }
        });
      }
      console.log('entra a validar');
    });
    this.controls.artista.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorArtista.forEach((error) => {
          if (this.controls.artista.hasError(error.tipo)) {
            this.mnsErrorArtista = error.msn;
          }
        });
      }
    });
    this.controls.album.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorAlbum.forEach((error) => {
          if (this.controls.album.hasError(error.tipo)) {
            this.mnsErrorAlbum = error.msn;
          }
        });
      }
      console.log('entra a validar');
    });
    this.controls.anio.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorAnio.forEach((error) => {
          if (this.controls.anio.hasError(error.tipo)) {
            this.mnsErrorAnio = error.msn;
          }
        });
      }
    });

    this.controls.genero.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorGenero.forEach((error) => {
          if (this.controls.genero.hasError(error.tipo)) {
            this.mnsErrorGenero = error.msn;
          }
        });
        if (this.mnsErrorGenero === '') {
          this.mnsErrorGenero = 'Genero inválido';
        }
      }
      console.log('entra a validar');
    });

  }

  generoId(index: any, estado: any) {
    return estado;
  }

  valorGenero(estado: any) {
    this.controls.genero.setValue(estado);
  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

}

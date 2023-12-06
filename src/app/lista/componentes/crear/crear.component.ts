import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from "sweetalert2";
import { take, takeUntil } from "rxjs/operators";
import { Validacion } from "../../../login/modelo/validacion";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { Router } from "@angular/router";
import { ListaService } from "../../servicios/lista.service";
import { ListaContenedorService } from "../../servicios/lista-contenedor.service";
import { Lista } from "../../modelo/lista";
import { Cancion } from "../../modelo/cancion";

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CrearComponent implements OnInit, OnDestroy, AfterViewInit {

  public errorNombre: Validacion[] = [
    {tipo: 'required', msn: 'Nombre es requerido'}
  ];

  public errorMonto: Validacion[] = [
    {tipo: 'required', msn: 'Descripcion es requerido'}
  ];

  public mnsErrorNombre = '';
  public mnsErrorDescripcion = '';


  public controls = {
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required])

  };

  public formGroup: FormGroup;

  private subs: ReplaySubject<void> = new ReplaySubject();

  private lista: Lista;

  constructor(
    private fb: FormBuilder,
    private listaService: ListaService,
    private contenedor: ListaContenedorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombre: this.controls.nombre,
      descripcion: this.controls.descripcion
    });
  }


  volver(): void{
    this.router.navigateByUrl('/lista/listar');
  }

  eventoCancion(canciones: Cancion[]) {
    this.lista.canciones = canciones;
  }

  guardar(): void {
    let timerInterval: string | number | NodeJS.Timeout | undefined;
    let tiempo = 1500;
    if (this.formGroup.valid) {

      const lista = {
        nombre: this.controls.nombre.value,
        descripcion: this.controls.descripcion.value,
        canciones: this.lista.canciones
      };

      Swal.fire({
        title: 'Guardando!',
        html: 'Por favor espere..........',
        timer: tiempo,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {

        }
      });

      this.listaService.crearLista(lista).subscribe({
      next: (resp:any) => {
        Swal.close();
        if (resp.idLista !== undefined) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Lista se ha creado con exito',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigateByUrl('/lista/listar');
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error creando lista',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    ,
      error: (err) => {
        console.log(err);
      },
        complete:() => {}
    });
    }
  }

  ngAfterViewInit(): void {
    console.log('entra a after view');
    this.controls.nombre.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorNombre.forEach((error) => {
          if (this.controls.nombre.hasError(error.tipo)) {
            this.mnsErrorNombre = error.msn;
          }
        });
      }
      console.log('entra a validar');
    });
    this.controls.descripcion.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorMonto.forEach((error) => {
          if (this.controls.descripcion.hasError(error.tipo)) {
            this.mnsErrorDescripcion = error.msn;
          }
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

}

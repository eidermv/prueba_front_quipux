import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import Swal from 'sweetalert2';
import { AuthService } from "../../servicio/auth.service";
import { Validacion } from "../../modelo/validacion";
import { SesionService } from "../../../app/service/sesion.service";
import { LocalService } from "../../../app/service/local.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  public errorUsuario: Validacion[] = [
    {tipo: 'required', msn: 'Usuario es requerido'}
  ];

  public errorPass: Validacion[] = [
    {tipo: 'required', msn: 'Contraseña es requerido'}
  ];


  public mnsErrorUs = '';
  public mnsErrorPass = '';



  public controls = {
    usuario: new FormControl('', [Validators.required]),
    contrasena: new FormControl('', [Validators.required])
  };

  hide = true;

  public usuarioForm: FormGroup;

  private subs: ReplaySubject<void> = new ReplaySubject();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sesion: SesionService,
    private localService: LocalService
  ) {
    this.usuarioForm = this.fb.group({
      usurios: this.controls.usuario,
      contrasena: this.controls.contrasena,
    });
    console.log('--- constructor de login');
  }

  ngOnInit(): void {

    if (this.sesion.logueado.value) {
      this.router.navigateByUrl('/lista/listar');
    } else {
      this.router.navigateByUrl('/login/iniciar');
    }
  }

  volver(): void{
    this.router.navigateByUrl('/lista/listar');
  }

  guardar(): void {
    let timerInterval: any;
    let tiempo = 1500;
    if (this.usuarioForm.valid) {
      const usuario = {usuario: this.controls.usuario.value, contrasena: this.controls.contrasena.value};
      let pass = environment.origin + " " ;
      // pass += btoa(JSON.stringify(usuario));
      pass += btoa(this.controls.usuario.value+":"+this.controls.contrasena.value);
      this.sesion.setLocalAuthKey(pass);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cargando...',
        showConfirmButton: false,
        timer: 1500
      });
      this.authService.login().subscribe({
      next:(valor)=>{
        Swal.fire({
          title: 'Validando!',
          html: 'Por favor espere.',
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
            console.log("--------------------->1 " + valor);
            if (valor.error === 0) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario logeado con exito',
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigateByUrl('/lista/listar');
              this.sesion.setLocalAuthKey(valor.key);
              this.localService.setJsonValue('logueado', 'true');
              this.sesion.guardarDatos(valor.data);
              this.sesion.logueado.next(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Usuario o contraseña incorrectos',
                showConfirmButton: false,
                timer: 1500
              });
              this.localService.setJsonValue('logueado', 'false');
              this.sesion.logueado.next(false);
            }
          }
        });
      }
    ,
      error: () => {
      },
        complete: () => {
          tiempo = 0;
        }
    });
    }
  }

  ngAfterViewInit(): void {
    console.log('entra a after view');
    this.controls.usuario.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorUsuario.forEach((error) => {
          if (this.controls.usuario.hasError(error.tipo)) {
            this.mnsErrorUs = error.msn;
          }
        });
      }
      console.log('entra a validar');
    });
    this.controls.contrasena.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorPass.forEach((error) => {
          if (this.controls.contrasena.hasError(error.tipo)) {
            this.mnsErrorPass = error.msn;
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ListaContenedorService } from './lista-contenedor.service';
import { take, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Lista } from '../modelo/lista';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(
    private http: HttpClient,
    private contenedor: ListaContenedorService
  ) { }

    listarTodos() {
        let listas: Lista[] = [];
        this.http.get(environment.apiUrl + 'lists').pipe(take(1)).subscribe({
        next: (data: any) => {
            if (data.length > 0) {
                // chistes = data.data;
                listas = data;
                console.log("------listar todas -> " + JSON.stringify(data));
                console.log("------listar conversion -> " + JSON.stringify(listas));

            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "No se han encontrado listas",
                    showConfirmButton: false,
                    timer: 1500
                });
                listas = [];
            }
        },
        error: error => {
            console.log(error);
        },
            complete: () => {
                this.contenedor.listas.next(listas);
            }
    });
    }

  listarChiste(id: string) {
    /*let chistes: Favorito[] = [];
    const paramsIn = new HttpParams().set('id', id);
    const value = { params: paramsIn };
    this.http.get(environment.apiUrl + 'chiste/listar', value).pipe(take(1)).subscribe( (data: any) => {
      if (data.error === 0) {
        chistes = data.data;
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data.mensaje,
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
      error => {
        console.log(error);
      },
      () => {
      this.contenedor.chistes.next(chistes);
      });*/
  }

  eliminarLista(nombre: string) {
    return this.http.delete(environment.apiUrl + 'lists/'+nombre).pipe(take(1));
  }

  consultarChiste() {
    let chiste: Lista = new Lista();
    const paramsIn = new HttpParams();
    const value = { params: paramsIn };
    this.http.get(environment.apiUrl + 'chiste/aleatorio', value).pipe(take(1)).subscribe( (data: any) => {
        if (data.id !== null) {
          chiste = data;
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No se pudo obtener chiste',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error => {
        console.log(error);
      },
      () => {
        //this.contenedor.lista.next(chiste);
      });
  }

  guardarFavorito(chiste: any) {
    // let paramsIn = new HttpParams().set('value', JSON.stringify(deuda));
    // let value = { params: paramsIn };
    return this.http.post(environment.apiUrl + 'chiste/crear', chiste).pipe(take(1)).subscribe(
      (resp: any) => {
        Swal.close();
        if (resp.error === 0) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Lista añadido a favoritos',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: resp.mensaje,
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
      }
    );
  }

  crearLista(lista: any) {
    return this.http.post(environment.apiUrl + 'lists', lista).pipe(take(1));
  }

  listarGeneros() {
    let generos: string[] = [];
    this.http.get(environment.apiUrl + 'lists/generos').pipe(take(1)).subscribe( {
    next: (data: any) => {
        if (data.generos.length > 0) {
          generos = data.generos;
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'No se obtuvo generos',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        this.contenedor.generos.next(generos);
      }
  });
  }
}

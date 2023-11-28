import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from "sweetalert2";
import { Opciones, OpcionSelect, TablaColumna } from '../../../app/modelo/tabla';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ListaService } from '../../servicios/lista.service';
import { ListaContenedorService } from '../../servicios/lista-contenedor.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SesionService } from '../../../app/service/sesion.service';
import { MatDialog } from "@angular/material/dialog";
import { ListarCancionesComponent } from "../listar-canciones/listar-canciones.component";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListarComponent implements OnInit, OnDestroy {

  /*
  idLista: number;
    : string;
    : string;
    canciones: Cancion[];
   */
  public columnas: TablaColumna[] = [
    { label: 'Id', propiedad: 'idLista', tipo: 'fixInitT', visible: true, cssClasses: [] },
    { label: 'Nombre', propiedad: 'nombre', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Descripcion', propiedad: 'descripcion', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Opciones', propiedad: 'option', tipo: 'option', visible: true, cssClasses: [] }
  ];
  public opciones: Opciones[] = [
    // {opcion: 1, icon: 'edit', texto: 'Editar'},
    // {opcion: 2, icon: 'visibility', texto: 'Ver'},
    {opcion: 3, icon: 'delete', texto: 'Eliminar'},
    {opcion: 4, icon: 'playlist_play', texto: 'Canciones'}
  ];
  public itemsPagina: number[] = [5, 10, 20];
  public tamanoH = 'mediana';
  public filtro = false;

  public dataSource = new MatTableDataSource<any[]>([]);
  private subs: ReplaySubject<void> = new ReplaySubject();

  public mostrarPaginacion = true;

  @ViewChild('matTable') table: MatTable<any> | undefined;

  private paginacion: MatPaginator;
  private ordenar: any;
  public tamano = 'table-container';

  @ViewChild(MatPaginator) set matPaginator(mypaginator: MatPaginator) {
    this.paginacion = mypaginator;
    this.cargarAtributos();
  }

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.ordenar = content;
    if (this.ordenar) {
      this.dataSource.sort = this.ordenar;
    }
  }

  constructor(
    private usuarioService: ListaService,
    private contenedor: ListaContenedorService,
    private router: Router,
    private sesion: SesionService,
    public dialog: MatDialog
  ) {
    console.log('--- constructor de listar');
  }

  ngOnInit(): void {
    // console.log(this.sesion.getDatos()[0].identificacion);
    this.usuarioService.listarTodos();
    this.contenedor.listas.asObservable().pipe(takeUntil(this.subs)).subscribe((value) => {
      this.cargarDatos(value);
    });
  }

  cargarAtributos(): void {
    this.dataSource.paginator = this.paginacion;
    this.dataSource.sort = this.ordenar;
  }

  cargarDatos(valores: any[]): void {
    this.dataSource.data = valores;
    if (valores.length > 5) {
      this.mostrarPaginacion = true;
      this.filtro = true;
    }
    // this.table.renderRows();
  }

  filtrar(event: Event): void {
    const filtroValor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValor.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  opcion(i: number, data: any, valor?: MatSlideToggleChange): void {
    const opcionClick: any = new OpcionSelect();
    opcionClick.opcion = i;
    opcionClick.dato = data;
    if (i === -1) {
      opcionClick.check = valor?.checked;
      // console.log('valor de swtch ' + valor.checked);
    }
    switch (i) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        Swal.fire({
          title: 'Estas seguro?',
          text: 'Deseas eliminar el chiste ' + data.id_favorito + ' ' + data.chiste,
          icon: 'warning',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.usuarioService.eliminarLista(data.nombre).subscribe({
              next: (resp: any) => {
                if (resp !== 'false') {
                  Swal.fire(
                    'Eliminado!',
                    'Lista se ha eliminado con exito.',
                    'success'
                  );
                  this.contenedor.listas.next(this.contenedor.listas.value.filter((lista) => lista.idLista !== data.idLista));
                  // this.cargarDatos(this.contenedor.deudas.value);
                } else {
                  Swal.fire(
                    'Fallo!',
                    'Lista no se ha eliminado.',
                    'error'
                  );
                }
              },
              error: () => {
                Swal.fire(
                  'Fallo!',
                  'Lista no se ha eliminado.',
                  'error'
                );
              },
              complete: () => {}
          });
          }
        });
        break;
      case 4:
        //abrir dialogo de canciones
          this.contenedor.cancionesLista.next(data.canciones);
        const dialogRef = this.dialog.open(ListarCancionesComponent, {
          width: '500px',
          data: {}
        });
        break;
    }
    // this.opcionSel.emit(opcionClick);
    // console.error(' ----- selecciono una opcion');
  }

  trackByProperty<T>(index: number, column: any): any {
    return column.propiedad;
  }

  trackByOpcion<T>(index: number, opt: any): any {
    return opt.opcion;
  }

  calcularW(label: string, propiedad: string): string {
    let cal = 0;

    const labels = label.split(' ');
    let mayor = 0;
    labels.forEach((valor) => {
      const t = valor.length;
      mayor = mayor < t ? t : mayor;
    });

    cal = mayor * 12;
    if (label === 'Ips'){
      cal = 180;
    }


    return cal + 'px';
  }

  trackByIndex(_: number, data: any): number {
    let col = this.columnas.find(item =>
        item.propiedad.toLocaleUpperCase().includes('ID'))?.propiedad;
    if (col!==undefined)
      return data[col];
    else
      return 0;
  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  get visibleColumns(): string[] {
    return this.columnas.filter(column => column.visible).map(column => column.propiedad);
  }

  irCrear(): void {
    this.router.navigateByUrl('/lista/crear');
  }
}

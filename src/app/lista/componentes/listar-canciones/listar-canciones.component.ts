import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Opciones, OpcionSelect, TablaColumna } from "../../../app/modelo/tabla";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ReplaySubject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ListaService } from "../../servicios/lista.service";
import { ListaContenedorService } from "../../servicios/lista-contenedor.service";
import { Router } from "@angular/router";
import { SesionService } from "../../../app/service/sesion.service";
import { takeUntil } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import Swal from "sweetalert2";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListarCancionesComponent implements OnInit, OnDestroy {

    /*
      {"idCancion":10,"titulo":"Prueba","artista":"Juan","album":"Viejitas","genero":"Merengue","anno":2023}
     */
public columnas: TablaColumna[] = [
        { label: 'Id', propiedad: 'idCancion', tipo: 'fixInitN', visible: true, cssClasses: [] },
        { label: 'Titulo', propiedad: 'titulo', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Artista', propiedad: 'artista', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Album', propiedad: 'album', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Genero', propiedad: 'genero', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Año', propiedad: 'anno', tipo: 'number', visible: true, cssClasses: [] },
        { label: 'Opciones', propiedad: 'option', tipo: 'option', visible: false, cssClasses: [] }
    ];
public opciones: Opciones[] = [
        // {opcion: 1, icon: 'edit', texto: 'Editar'},
        // {opcion: 2, icon: 'visibility', texto: 'Ver'},
        // {opcion: 3, icon: 'delete', texto: 'Eliminar'}
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
        public dialogRef: MatDialogRef<ListarCancionesComponent>
) {
        console.log('--- constructor de listar');
    }

    ngOnInit(): void {
        this.contenedor.cancionesLista.asObservable().pipe(takeUntil(this.subs)).subscribe((value) => {
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

    onClick() {
    this.contenedor.cancionesLista.next([]);
        this.dialogRef.close();
    }
}

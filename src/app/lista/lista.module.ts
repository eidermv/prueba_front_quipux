import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaRoutingModule } from './lista-routing.module';
import { ListarComponent } from './componentes/listar/listar.component';
import { CrearComponent } from './componentes/crear/crear.component';
import { ListarCancionesComponent } from './componentes/listar-canciones/listar-canciones.component';

import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { CrearListaCancionesComponent } from './componentes/crear-lista-canciones/crear-lista-canciones.component';
import { MatSelectModule } from "@angular/material/select";


@NgModule({
  declarations: [
    ListarComponent,
    CrearComponent,
    ListarCancionesComponent,
    CrearListaCancionesComponent
  ],
    imports: [
        CommonModule,
        ListaRoutingModule,
        MatCardModule,
        MatTooltipModule,
        MatButtonModule,
        MatFormFieldModule,
        MatTableModule,
        MatIconModule,
        NgbPopoverModule,
        MatPaginatorModule,
        MatInputModule,
        MatSortModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSelectModule
    ]
})
export class ListaModule { }

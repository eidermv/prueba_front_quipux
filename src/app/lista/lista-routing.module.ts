import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from "./componentes/listar/listar.component";
import { CrearComponent } from "./componentes/crear/crear.component";

const routes: Routes = [
  {
    path: 'listar',
    component: ListarComponent,
    data: {
      title: 'Listar listas '
    }
  },
  {
    path: 'crear',
    component: CrearComponent,
    data: {
      title: 'Crear lista '
    }
  },
  {
    path: 'listar_canciones',
    component: CrearComponent,
    data: {
      title: 'Listar canciones '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaRoutingModule { }

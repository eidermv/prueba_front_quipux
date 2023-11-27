import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./app/permiso/auth.guard";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'lista',
    canActivate: [AuthGuard],
    loadChildren: () => import('./lista/lista.module').then(m => m.ListaModule)
  },
  {path: '', redirectTo: '/login/iniciar', pathMatch: 'full'},
  {path: '**', redirectTo: '/login/iniciar', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

import { UsuariosComponent } from './administracion/usuarios/usuarios.component';
import { MedicosComponent } from './administracion/medicos/medicos.component';
import { HospitalesComponent } from './administracion/hospitales/hospitales.component';
import { MedicoComponent } from './administracion/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

import { AdminGuard } from './../guards/admin.guard';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' } },
  { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Buscar' } },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' } },
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' } },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
  { path: 'profile', component: PerfilComponent, data: { titulo: 'Perfil Usuario' } },

  // Administración
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Gestión de Hospitales' } },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Gestión de Medicos' } },
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Editar Medico' } },

  // Rutas de administrador
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { titulo: 'Gestión de Usuarios' } },
];

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }

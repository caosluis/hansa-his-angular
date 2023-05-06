import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { TarjetaVisitaComponent } from './components/tarjeta-visita/tarjeta-visita.component';
import { TarjetaInstalacionComponent } from './components/tarjeta-instalacion/tarjeta-instalacion.component';
import { ReporteTabularComponent } from './components/reporte-tabular/reporte-tabular.component';
import { ComponentsComponent } from './components/components.component';

const routes: Routes = [
  { path: '', component: ComponentsComponent },
  { path: 'reporte', component: ReporteTabularComponent },
  { path: 'reporte', component: ReporteTabularComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'tarjeta', component: TarjetaVisitaComponent },
  { path: 'tarjetainstalacion', component: TarjetaInstalacionComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { VisitasService } from '../../services/visitas.service';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-reporte-tabular',
  templateUrl: './reporte-tabular.component.html',
  styleUrls: ['./reporte-tabular.component.css'],
})
export class ReporteTabularComponent implements OnInit {
  FechaActual: any = new Date();
  FechaSeleccionada: any = new Date();
  visitas: any;
  division_seleccionada: any;
  regional_seleccionada: any;
  instalacion_seleccionada: any = 'Todas';
  tipoot_seleccionada: any = 'Todos';
  EstadoSeleccionado: any = 'Todos';

  RolUsuarioActual: any;
  UsuarioActualID: any;
  proyecto_seleccionado: any;
  ProyectosList: any;
  InstalacionesList: any;
  displayedColumns: string[] = [
    'VisitaID',
    'CodUsuario',
    'Cuadrilla',
    'Estado',
    'Instalacion',
    'Ot',
    'TipoOt',
    'cliente',
    'fecha_final_plan',
    'fecha_final_real',
    'fecha_inicio_plan',
    'fecha_inicio_real',
    'tiposinstalaciones',
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private CoordenadasService: CoordenadasService,
    private VisitasService: VisitasService,
    private activatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Socket: Socket
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.division_seleccionada = params['division'];
      this.regional_seleccionada = params['regional'];
      this.RolUsuarioActual = params['usuario'];
      this.instalacion_seleccionada = params['instalacionid'];
      this.UsuarioActualID = params['usuarioid'];
      this.proyecto_seleccionado = params['proyectoid'];
    });

    this.Socket.on('HANIN_VISITA_ENTRANTE_TIEMPO_REAL', (point) => {
      this.Refresh();
    });
  }

  ngOnInit(): void {
    this.CargarHaninproyectosUnaRegional();
    this.CargarHaninInstalaciones();
  }
  ngAfterViewChecked() {
    this.ChangeDetectorRef.detectChanges();
  }
  ngAfterViewInit() {
    this.CargarVisitas();
  }
  CargarVisitas() {
    this.VisitasService.hanin_visitas_mapa_tiempo_reals_get(
      this.FechaSeleccionada,
      this.division_seleccionada,
      this.regional_seleccionada,
      this.instalacion_seleccionada,
      this.proyecto_seleccionado,
      this.tipoot_seleccionada,
      this.EstadoSeleccionado
    ).then((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  Refresh() {
    this.VisitasService.hanin_visitas_mapa_tiempo_reals_get(
      this.FechaActual,
      this.division_seleccionada,
      this.regional_seleccionada,
      this.instalacion_seleccionada,
      this.proyecto_seleccionado,
      this.tipoot_seleccionada,
      this.EstadoSeleccionado
    ).then((data) => {
      this.dataSource.data = data;
    });
  }
  SeleccionarFecha(event) {
    this.FechaSeleccionada = event.value;
    this.Refresh();
  }
  async SeleccionarProyecto(proyecto) {
    this.proyecto_seleccionado = proyecto.value;
    await this.CargarHaninInstalaciones();
    this.instalacion_seleccionada = this.InstalacionesList[0].id;
    this.regional_seleccionada = this.InstalacionesList.find(
      (x) => x.id === this.InstalacionesList[0].id
    ).idregion_c;
    this.Refresh();
  }
  async SeleccionarInstalacion(instalacion) {
    this.instalacion_seleccionada = instalacion.value;
    this.regional_seleccionada = this.InstalacionesList.find(
      (x) => x.id === instalacion.value
    ).idregion_c;
    console.log(this.regional_seleccionada);

    this.Refresh();
  }
  SeleccionarTipoOT(ot) {
    this.tipoot_seleccionada = ot.value;
    this.Refresh();
  }
  CargarHaninproyectosUnaRegional() {
    this.CoordenadasService.CargarHaninproyectosUnaRegional(
      this.UsuarioActualID
    ).then((data) => {
      this.ProyectosList = data;
    });
  }
  CargarHaninInstalaciones() {
    this.CoordenadasService.CargarHanininstalacionesUnaRegional(
      this.division_seleccionada,
      this.proyecto_seleccionado
    ).then((data) => {
      this.InstalacionesList = data;
    });
  }
}

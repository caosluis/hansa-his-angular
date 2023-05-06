import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ViewChildren,
} from '@angular/core';
import 'leaflet';
import 'leaflet.markercluster';
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { Socket } from 'ngx-socket-io';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as moment from 'moment';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgElement, WithProperties } from '@angular/elements';
import { Supervisor } from 'src/app/models/supervisor';
import { IndicadoresComponent } from '../indicadores/indicadores.component';
import { MatDialog } from '@angular/material/dialog';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.js';
import '@fortawesome/fontawesome-free/js/all.js';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import { PopupmantenimientoComponent } from '../popupmantenimiento/popupmantenimiento.component';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopupComponent } from '../popup/popup.component';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import { InventariosComponent } from '../inventarios/inventarios.component';
import { VisitasService } from '../../services/visitas.service';
import { TareasService } from '../../services/tareas.service';

declare let L;

var map;
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  closeResult = '';
  cuadrillas: any = [];
  visitas: any;
  tareas: any = [];
  cliente: any = [];
  supervisor: any = [];
  supervisor_dynamic: Supervisor[] = [];
  ots: any = [];
  visitasColumns: string[] = [
    'Ot',
    'CodUsuario',
    'Cuadrilla',
    'Estado',
    'Instalacion',
    'TipoOt',
    'cliente',
    'fecha_final_plan',
    'fecha_final_real',
    'fecha_inicio_plan',
    'fecha_inicio_real',
    'tiposinstalaciones',
  ];
  incidentesColumns: string[] = ['id', 'name', 'CodUsuario', 'description', 'estado_c'];

  ProyectosList: any;
  InstalacionesList: any;
  FiltroOts_dynamic = [];
  division_seleccionada: any;
  regional_seleccionada: any;
  instalacion_seleccionada: any;
  proyecto_seleccionado: any;
  tipoot_seleccionada = 'Todos';
  EstadoSeleccionado = 'Todos';
  marcadores_cargados_real: any;
  marcadores_cargados_plan: any;
  marcadores_cargados_plan_actualizados: any;
  marcadores_cargados_real_actualizados: any;
  CuadrillasPanelIzquierdo_dynamic: any;
  timeline: any;
  MarkerPopupCabecera: any;
  MarkerPopupContenido: any;
  EstadoVisitaPopup: any;
  RolUsuarioActual: any;
  UsuarioActualID: any;
  incidentesUsuarioList: any = [];
  VisitasPorInstalacionList: any = [];


  IndicadorPanelIzquierdoParcialVisitas: any = [];
  IndicadorPanelIzquierdoTotalVisitas: any = [];
  tecnico_chart = [];
  fecha_inicio_no_iniciado = '1899-01-01 00:00:00';
  fecha_final_no_iniciado = '1899-01-01 00:00:00';
  HoraMetabase: any;
  markers = [];
  RegionesLocalizacionList: any;
  ConfiguracionList: any;

  ContadorVisitas: any;
  ContadorVisitasFinalizadas: any;

  IconNuevo = L.icon({
    iconUrl: 'assets/images/Marcador-gris.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });
  IconNuevoPlan = L.icon({
    iconUrl: 'assets/images/tachuela-gris.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });

  IconCancelado = L.icon({
    iconUrl: 'assets/images/Marcador-rojo.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });
  IconCanceladoPlan = L.icon({
    iconUrl: 'assets/images/tachuela-rojo.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });

  IconFinalizado = L.icon({
    iconUrl: 'assets/images/Marcador-verde.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });
  IconFinalizadoPlan = L.icon({
    iconUrl: 'assets/images/tachuela-verda.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });

  IconEnCamino = L.icon({
    iconUrl: 'assets/images/Marcador-naranja.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });
  IconEnCaminoPlan = L.icon({
    iconUrl: 'assets/images/tachuela-naranja.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });

  IconEnProgreso = L.icon({
    iconUrl: 'assets/images/Marcador-amarillo.gif',
    iconSize: [40, 55],
    popupAnchor: [1, -15],
  });
  IconEnProgresoPlan = L.icon({
    iconUrl: 'assets/images/tachuela-amarillo.png',
    iconSize: [30, 35],
    popupAnchor: [1, -15],
  });

  FechaSeleccionada: any = new Date();

  queryLoopback: any;
  dataSourceVisitas: MatTableDataSource<any>;
  dataSourceIncidentes: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private CoordenadasService: CoordenadasService,
    private VisitasService: VisitasService,
    private TareasService: TareasService,
    private socket: Socket,
    config: NgbCarouselConfig,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.socket.on('HANIN_TAREA_ENTRANTE_TIEMPO_REAL', (point) => {
      if (point.length > 0) {
        if (
          moment(point[0].fecha_inicio_plan).format('DD.MM.YYYY') ==
          moment(this.FechaSeleccionada).format('DD.MM.YYYY') &&
          point[0].iddivision_c == this.division_seleccionada &&
          point[0].idregional_c == this.regional_seleccionada.substring(0, 2)
        ) {
          this.CargarTareas();
          this.updateTarea(point[0]);
        }
      }
    });
    this.socket.on('HANIN_VISITA_ENTRANTE_TIEMPO_REAL', (point) => {
      console.log(point);

      if (point.length > 0) {
        if (
          moment(point[0].fecha_inicio_plan).format('DD.MM.YYYY') ==
          moment(this.FechaSeleccionada).format('DD.MM.YYYY') &&
          point[0].DivisionID == this.division_seleccionada &&
          point[0].RegionID == this.regional_seleccionada &&
          point[0].InstalacionID == this.instalacion_seleccionada &&
          this.tipoot_seleccionada == 'Todos'
        ) {
          console.log('todos');

          this.Refresh();
          this.updateVisita(point[0]);
          this.AgregarMarcador(point[0]);
        } else if (
          moment(point[0].fecha_inicio_plan).format('DD.MM.YYYY') ==
          moment(this.FechaSeleccionada).format('DD.MM.YYYY') &&
          point[0].DivisionID == this.division_seleccionada &&
          point[0].RegionID == this.regional_seleccionada &&
          point[0].InstalacionID == this.instalacion_seleccionada &&
          point[0].TipoOt == this.tipoot_seleccionada
        ) {
          console.log('1');
          this.Refresh();
          this.updateVisita(point[0]);
          this.AgregarMarcador(point[0]);
        }
      }
    });
  }



  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }

  async SeleccionarFecha(event) {
    this.FechaSeleccionada = event.value;
    this.LimpiarMapa();
    this.CargarVisitas();
    this.CargarTareas();
    this.Cargartickets();
    this.CargarHaninInstalaciones()
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }
  async SeleccionarDivision(division) {
    this.division_seleccionada = division.value;
    this.CargarVisitas();
    this.CargarTareas();
    this.Cargartickets();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }
  async SeleccionarProyecto(proyecto) {
    this.LimpiarMapa();
    this.proyecto_seleccionado = proyecto.value;
    await this.CargarHaninInstalaciones();
    this.instalacion_seleccionada = this.InstalacionesList[0].id;
    this.regional_seleccionada = this.InstalacionesList.find(
      (x) => x.id === this.InstalacionesList[0].id
    ).idregion_c;
    await this.CargarVisitas();
    await this.CargarTareas();
    this.Cargartickets();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }
  async SeleccionarInstalacion(instalacion) {
    this.LimpiarMapa();
    this.instalacion_seleccionada = instalacion.value;
    this.regional_seleccionada = this.InstalacionesList.find(
      (x) => x.id === instalacion.value
    ).idregion_c;
    /* this.regional_seleccionada = instalacion.value.idregion_c; */
    this.CargarVisitas();
    this.CargarTareas();
    this.Cargartickets();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }
  async SeleccionarRegional(regional) {
    this.regional_seleccionada = regional.value;

    this.CargarVisitas();
    this.CargarTareas();
    this.Cargartickets();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }
  async SeleccionarTipoOT(ot) {
    this.LimpiarMapa();
    this.tipoot_seleccionada = ot.value;
    this.CargarVisitas();
    this.CargarTareas();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }

  async SeleccionarEstado(Estado) {
    this.EstadoSeleccionado = Estado.value;
    this.LimpiarMapa();
    this.CargarVisitas();
    this.CargarTareas();
    await this.CargarUsuariosPanelIzquierdo();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }

  updateVisita(visitaentrante) {
    this.QuitarMarcador(visitaentrante.VisitaID);
    this.QuitarMarcador(visitaentrante.VisitaID + '_plan');
    if (
      this.visitas.some((visita) => visita.VisitaID === visitaentrante.VisitaID)
    ) {
      this.visitas.forEach((visita) => {
        if (visita.VisitaID == visitaentrante.VisitaID) {
          visita.Estado = visitaentrante.Estado;
          visita.fecha_inicio_real = visitaentrante.fecha_inicio_real;
          visita.fecha_final_real = visitaentrante.fecha_final_real;
          visita.latitud_plan = visitaentrante.latitud_plan;
          visita.longitud_plan = visitaentrante.longitud_plan;
          visita.description = visitaentrante.description;
        }
      });
    } else {
      this.visitas.push(visitaentrante);
    }
  }
  updateTarea(tareaentrante) {
    if (this.tareas.some((tarea) => tarea.TareaID === tareaentrante.TareaID)) {
      this.tareas.forEach((tarea) => {
        if (tarea.TareaID == tareaentrante.VisitaID) {
          tarea.status = tareaentrante.Estado;
          tarea.fecha_inicio_real_c = tareaentrante.fecha_inicio_real;
          tarea.fecha_fin_real_c = tareaentrante.fecha_final_real;
          tarea.description = tareaentrante.description;
        }
      });
    } else {
      var tareanueva = {
        TareaID: tareaentrante.TareaID,
        status: tareaentrante.status,
        parent_id: tareaentrante.parent_id,
        tipotarea_c: tareaentrante.tipotarea_c,
        fecha_inicio_real_c: tareaentrante.fecha_inicio_real_c,
        fecha_fin_real_c: tareaentrante.fecha_fin_real_c,
        IdVisita: tareaentrante.IdVisita,
        fecha_visita_c: tareaentrante.fecha_visita_c,
        iddivision_c: tareaentrante.iddivision_c,
        idregional_c: tareaentrante.idregional_c,
        idamercado_c: tareaentrante.idamercado_c,
        user_name: tareaentrante.user_name,
        description: tareaentrante.description,
      };
      this.visitas.push(tareanueva);
    }
  }

  Refresh() {
    this.VisitasService.hanin_visitas_mapa_tiempo_reals_get(
      this.FechaSeleccionada,
      this.division_seleccionada,
      this.regional_seleccionada,
      this.instalacion_seleccionada,
      this.proyecto_seleccionado,
      this.tipoot_seleccionada,
      this.EstadoSeleccionado
    ).then((data) => {
      this.dataSourceVisitas.data = data;
    });
    this.Cargartickets()
    this.CargarHaninInstalaciones()
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }

  SeleccionarMarkerTimeline(Visita) {
    this.marcadores_cargados_real.eachLayer((layer) => {
      if (layer.feature.properties.VisitaID == Visita.visita.VisitaID) {
        layer.openPopup();
      }
    });
  }

  async CargarTimeline(fecha, Cuadrilla) {
    let year = fecha.start_time.getFullYear();
    let month = fecha.start_time.getMonth();
    let day = fecha.start_time.getDate();
    var count = 0;
    this.timeline = [];
    this.visitas.forEach((point) => {
      if (point.assigned_user_id == Cuadrilla.TecnicoID) {
        {
          if (point.Estado == 'Finalizado') {
            count = count + 1;
            let timeline_data = {
              name: Cuadrilla.user_name,
              dataini: point.fecha_inicio_real,
              datafin: point.fecha_final_real,
              visita: point,
              color: '#28a745',
              border: 'black',
            };
            this.timeline.push(timeline_data);
          } else if (point.Estado == 'En Progreso') {
            count = count + 1;
            let timeline_data = {
              name: Cuadrilla.user_name,
              dataini: point.fecha_inicio_real,
              datafin:
                "'" +
                moment(this.FechaSeleccionada.start_time).format(
                  'YYYY-MM-DD HH:mm'
                ) +
                "'",
              visita: point,
              color: '#d39e00',
              border: 'black',
            };
            this.timeline.push(timeline_data);
          }
        }
      }
    });

    var chart = am4core.create('charttimeline', am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';
    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;
    chart.data = this.timeline;
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm';
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.baseInterval = { count: 1, timeUnit: 'minute' };
    dateAxis.min = new Date(year, month, day, 6, 0, 0, 0).getTime();
    dateAxis.max = new Date(year, month, day, 19, 0, 0, 0).getTime();
    dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;
    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText = '{name}: {openDateX} - {dateX}';
    series1.dataFields.openDateX = 'dataini';
    series1.dataFields.dateX = 'datafin';
    series1.dataFields.categoryY = 'name';
    series1.columns.template.propertyFields.fill = 'color'; // get color from data
    series1.columns.template.propertyFields.stroke = 'border';
    series1.columns.template.strokeOpacity = 1;
    series1.tooltip.background.fill = am4core.color('#CEB1BE');
    series1.columns.template.events.on(
      'hit',
      function (ev) {
        this.SeleccionarMarkerTimeline(ev.target.dataItem.dataContext);
      },
      this
    );

    chart.scrollbarX = new am4core.Scrollbar();
  }
  async CargarLineaDeTiempo(vendedor) {
    this.CargarTimeline(this.FechaSeleccionada, vendedor);
  }

  /*   ActualizarParciales(TecnicoID) {
      this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count_finalizadas(
        this.FechaSeleccionada,
        TecnicoID,
        this.tipoot_seleccionada
      ).then((data) => {
        
      });
    }
    ActualizarTotales(TecnicoID) {
      this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count(
        this.FechaSeleccionada,
        TecnicoID,
        this.tipoot_seleccionada
      ).then((data) => {
      
      });
    }
   */
  async CargarUsuariosPanelIzquierdo() {
    this.cuadrillas = [];
    this.IndicadorPanelIzquierdoTotalVisitas = [];
    this.IndicadorPanelIzquierdoParcialVisitas = [];
    await this.CoordenadasService.CargarCuadrillasPanelIzquierdo(
      this.instalacion_seleccionada,
      this.tipoot_seleccionada
    ).then((data) => {
      this.cuadrillas = data
      /*    data.forEach((element) => {
           this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count_finalizadas(
             this.FechaSeleccionada,
             element.TecnicoID,
             this.tipoot_seleccionada
           ).then((data) => {
             this.IndicadorPanelIzquierdoParcialVisitas.push({
               TecnicoID: element.TecnicoID,
               Cantidad: data.count,
             });
           });
   
           this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count(
             this.FechaSeleccionada,
             element.TecnicoID,
             this.tipoot_seleccionada
           ).then((data) => {
             this.IndicadorPanelIzquierdoTotalVisitas.push({
               TecnicoID: element.TecnicoID,
               Cantidad: data.count,
             });
           });
           this.cuadrillas.push(element);
         });
         this.CuadrillasPanelIzquierdo_dynamic = data;
         data.forEach((point) => {
           var tecnico = {
             user_name: point.user_name,
           };
           this.tecnico_chart.push(tecnico.user_name);
         }); */
    });
  }

  CargarHaninsupervisorUnaRegional() {
    this.CoordenadasService.CargarHaninsupervisorUnaRegional(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.proyecto_seleccionado
    ).then((data) => {
      this.supervisor = data;
      this.supervisor_dynamic = data;
    });
  }

  CargarHaninProyectos() {
    this.CoordenadasService.CargarHaninproyectosUnaRegional(
      this.UsuarioActualID
    ).then((data) => {
      this.ProyectosList = data;
    });
  }

  async CargarHaninInstalaciones() {
    this.VisitasPorInstalacionList = []
    await this.CoordenadasService.CargarHanininstalacionesUnaRegional(
      this.division_seleccionada,
      this.proyecto_seleccionado
    ).then((data) => {
      this.InstalacionesList = data;
      data.forEach(element => {
        this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_instalacionid(element.id, this.FechaSeleccionada).then(data => {
          this.VisitasPorInstalacionList.push({
            "InstalacionID": element.id,
            "count": data.count
          })
        })
      });
    });
    return true;
  }

  CargarTareas() {
    this.TareasService.hanin_tareas_mapa_tiempo_reals_get(
      this.FechaSeleccionada,
      this.proyecto_seleccionado,
      this.instalacion_seleccionada
    ).then((data) => {
      this.tareas = data;
    });
  }

  async CargarVisitas() {
    this.visitas = [];
    await this.VisitasService.hanin_visitas_mapa_tiempo_reals_get(
      this.FechaSeleccionada,
      this.division_seleccionada,
      this.regional_seleccionada,
      this.instalacion_seleccionada,
      this.proyecto_seleccionado,
      this.tipoot_seleccionada,
      this.EstadoSeleccionado
    ).then((data) => {
      this.visitas = data;
      this.dataSourceVisitas = new MatTableDataSource(data);
      this.dataSourceVisitas.paginator = this.paginator;
      this.dataSourceVisitas.sort = this.sort;
      this.Localizacion();
      /* var caracteristicas_marker_real = [];
      var caracteristicas_marker_plan = []; */
      data.forEach((point) => {
        if (point.TipoOt == '01') {
          switch (point.Estado) {
            case 'Nuevo':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconNuevo,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );

              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconNuevoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_real = point.latitud_plan;
              MarcadorVisitaPlan.longitud_real = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              break;
            case 'Cancelado':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconCancelado,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );

              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconCanceladoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_real = point.latitud_plan;
              MarcadorVisitaPlan.longitud_real = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              break;

            case 'Finalizado':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconFinalizado,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );

              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconFinalizadoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_real = point.latitud_plan;
              MarcadorVisitaPlan.longitud_real = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              break;
            case 'En Camino':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconEnCamino,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );

              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconEnCaminoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_real = point.latitud_plan;
              MarcadorVisitaPlan.longitud_real = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              break;
            case 'En Progreso':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconEnProgreso,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );

              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconEnProgresoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_real = point.latitud_plan;
              MarcadorVisitaPlan.longitud_real = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<PopupComponent> = document.createElement(
                      'popup-instalacion'
                    ) as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              break;
          }
        } else if (point.TipoOt == '02') {
          switch (point.Estado) {
            case 'Nuevo':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconNuevo,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconNuevoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_plan = point.latitud_plan;
              MarcadorVisitaPlan.longitud_plan = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              break;
            case 'Cancelado':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconCancelado,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconCanceladoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_plan = point.latitud_plan;
              MarcadorVisitaPlan.longitud_plan = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              break;

            case 'Finalizado':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconFinalizado,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconFinalizadoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_plan = point.latitud_plan;
              MarcadorVisitaPlan.longitud_plan = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              break;
            case 'En Camino':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconEnCamino,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconEnCaminoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_plan = point.latitud_plan;
              MarcadorVisitaPlan.longitud_plan = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              break;
            case 'En Progreso':
              var MarcadorVisita = L.marker(
                [parseFloat(point.latitud_real), parseFloat(point.longitud_real)],
                {
                  icon: this.IconEnProgreso,
                }
              );
              MarcadorVisita._id = point.VisitaID;
              MarcadorVisita.Estado = point.Estado;
              MarcadorVisita.latitud_real = point.latitud_real;
              MarcadorVisita.longitud_real = point.longitud_real;
              MarcadorVisita.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisita.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisita);
              this.markers.push(MarcadorVisita);
              var MarcadorVisitaPlan = L.marker(
                [parseFloat(point.latitud_plan), parseFloat(point.longitud_plan)],
                {
                  icon: this.IconEnProgresoPlan,
                }
              );
              MarcadorVisitaPlan._id = point.VisitaID + '_plan';
              MarcadorVisitaPlan.Estado = point.Estado;
              MarcadorVisitaPlan.latitud_plan = point.latitud_plan;
              MarcadorVisitaPlan.longitud_plan = point.longitud_plan;
              MarcadorVisitaPlan.bindPopup(
                (fl) => {
                  const DetalleVisita: NgElement &
                    WithProperties<
                      PopupmantenimientoComponent
                    > = document.createElement('popup-mantenimiento') as any;
                  DetalleVisita.addEventListener('closed', () =>
                    document.body.removeChild(DetalleVisita)
                  );
                  DetalleVisita.data = point;
                  document.body.appendChild(DetalleVisita);
                  return DetalleVisita;
                },
                { maxHeight: 'auto', maxWidth: 'auto' }
              );
              MarcadorVisitaPlan.bindTooltip(
                point.VisitaID + '<br>' + point.Ot + '<br>' + point.CodUsuario
              );
              map.addLayer(MarcadorVisitaPlan);
              this.markers.push(MarcadorVisitaPlan);
              break;
          }
        }
      });
    });
  }

  SeleccionarMarker(VisitaID) {
    this.markers.forEach((marker) => {
      if (marker._id == VisitaID) {
        map.flyTo([parseFloat(marker.latitud_real) + 0.1, parseFloat(marker.longitud_real)], 12);
        marker.openPopup();
      }
    });
  }

  AgregarMarcador(visitaentrante) {
    if (visitaentrante.TipoOt == '01') {
      switch (visitaentrante.Estado) {
        case 'Nuevo':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconNuevo,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<PopupComponent> = document.createElement(
                  'popup-instalacion'
                ) as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'Cancelado':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconCancelado,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<PopupComponent> = document.createElement(
                  'popup-instalacion'
                ) as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;

        case 'Finalizado':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconFinalizado,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<PopupComponent> = document.createElement(
                  'popup-instalacion'
                ) as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'En Camino':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconEnCamino,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<PopupComponent> = document.createElement(
                  'popup-instalacion'
                ) as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'En Progreso':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconEnProgreso,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<PopupComponent> = document.createElement(
                  'popup-instalacion'
                ) as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
      }
    } else if (visitaentrante.TipoOt == '02') {
      switch (visitaentrante.Estado) {
        case 'Nuevo':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconNuevo,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<
                  PopupmantenimientoComponent
                > = document.createElement('popup-mantenimiento') as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'Cancelado':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconCancelado,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<
                  PopupmantenimientoComponent
                > = document.createElement('popup-mantenimiento') as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;

        case 'Finalizado':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconFinalizado,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<
                  PopupmantenimientoComponent
                > = document.createElement('popup-mantenimiento') as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'En Camino':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconEnCamino,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<
                  PopupmantenimientoComponent
                > = document.createElement('popup-mantenimiento') as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
        case 'En Progreso':
          var MarcadorVisita = L.marker(
            [parseFloat(visitaentrante.latitud_real), parseFloat(visitaentrante.longitud_real)],
            {
              icon: this.IconEnProgreso,
            }
          );
          MarcadorVisita._id = visitaentrante.VisitaID;
          MarcadorVisita.Estado = visitaentrante.Estado;
          MarcadorVisita.latitud_real = visitaentrante.latitud_real;
          MarcadorVisita.longitud_real = visitaentrante.longitud_real;
          MarcadorVisita.bindPopup(
            (fl) => {
              const DetalleVisita: NgElement &
                WithProperties<
                  PopupmantenimientoComponent
                > = document.createElement('popup-mantenimiento') as any;
              DetalleVisita.addEventListener('closed', () =>
                document.body.removeChild(DetalleVisita)
              );
              DetalleVisita.data = visitaentrante;
              document.body.appendChild(DetalleVisita);
              return DetalleVisita;
            },
            { maxHeight: 'auto', maxWidth: 'auto' }
          );
          MarcadorVisita.bindTooltip(
            visitaentrante.VisitaID +
            '<br>' +
            visitaentrante.Ot +
            '<br>' +
            visitaentrante.CodUsuario
          );
          map.addLayer(MarcadorVisita);
          this.markers.push(MarcadorVisita);
          break;
      }
    }
  }
  async CargarRegionales() {
    await this.CoordenadasService.RegionesLocalizacion_get().then(data => {
      this.RegionesLocalizacionList = data
    })
  }
  async CargarConfiguracion() {
    await this.CoordenadasService.Configuracion_get().then(data => {
      this.ConfiguracionList = data
    })
  }
  Cargartickets() {
    console.log(this.InstalacionesList);

    this.CoordenadasService.hanin_ordenestrabajos_get(this.FechaSeleccionada).then(ots => {
      var incidentes = []
      this.incidentesUsuarioList = []
      if (this.InstalacionesList) {
        for (let ot of ots) {
          this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_orderid(ot.id).then(data => {
            if (data.length > 0) {
              this.incidentesUsuarioList.push({
                CodUsuario: data[0].CodUsuario,
                OrdenTrabajoID: ot.id
              })
            }
          })
          this.incidentesUsuarioList.push()
          for (let instalacion of this.InstalacionesList) {
            if (instalacion.id == ot.hanin_instalaciones_id) {
              incidentes.push(ot)
            }
          }
        }
        this.dataSourceIncidentes = new MatTableDataSource(incidentes);
      }
    })
  }
  Localizacion() {
    if (this.RegionesLocalizacionList) {
      for (let element of this.RegionesLocalizacionList) {
        if (this.regional_seleccionada == element.RegionID) {
          map.setView([element.Latitud, element.Longitud], 12);
        }
      }
    }
  }
  QuitarMarcador(VisitaID) {
    this.markers.forEach((marker) => {
      if (marker._id == VisitaID) {
        const removeIndex = this.markers.findIndex(
          (item) => item._id === VisitaID
        );
        map.removeLayer(marker);
        this.markers.splice(removeIndex, 1);
      }
    });
  }
  openInNewTab(url) {
    var win = window.open(url + '?var_asig=' + this.HoraMetabase, '_blank');
    win.focus();
  }

  modalIndicadores(): void {
    const dialogRef = this.dialog.open(IndicadoresComponent, {
      maxWidth: '100%',
      maxHeight: '100%',
      width: '100%',
      height: '100%',
      data: {
        division: this.division_seleccionada,
        regional: this.regional_seleccionada,
        proyecto: this.proyecto_seleccionado,
      },
    });

    dialogRef.afterClosed().subscribe((datosproveedor) => {
      if (datosproveedor != undefined) {
      }
    });
  }
  LimpiarMapa() {
    this.markers.forEach((marker) => {
      map.removeLayer(marker);
    });
    this.markers = [];
  }
  FiltroBuscar(filterValue: string) {
    this.dataSourceVisitas.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceVisitas.paginator) {
      this.dataSourceVisitas.paginator.firstPage();
    }
  }



  CargarContadorEntregas() {
    this.ContadorVisitas = []
    for (let element of this.cuadrillas) {
      this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count(
        this.FechaSeleccionada, element.user_name, this.tipoot_seleccionada
      ).then((data) => {
        this.ContadorVisitas.push({
          CodUsuario: element.user_name,
          count: data.count
        })
      });
    }
  }

  CargarContadorEntregasFinalizadas() {
    this.ContadorVisitasFinalizadas = []
    for (let element of this.cuadrillas) {
      this.VisitasService.hanin_visitas_mapa_tiempo_reals_get_count_finalizadas(
        this.FechaSeleccionada, element.user_name, this.tipoot_seleccionada
      ).then((data) => {
        this.ContadorVisitasFinalizadas.push({
          CodUsuario: element.user_name,
          count: data.count
        })
      });
    }
  }

  MostrarContador(CodUsuario) {
    if (this.ContadorVisitas) {
      for (let element of this.ContadorVisitas) {
        if (element.CodUsuario == CodUsuario) {
          return element.count
        }
      }
    }
  }

  MostrarContadorFinalizadas(CodUsuario) {
    if (this.ContadorVisitasFinalizadas) {
      for (let element of this.ContadorVisitasFinalizadas) {
        if (element.CodUsuario == CodUsuario) {
          return element.count
        }
      }
    }
  }

  Visible(ProyectoID) {
    if (this.ConfiguracionList) {
      for (
        let element of this.ConfiguracionList
      ) {
        if (
          element.ProyectoID == ProyectoID
        ) {
          return true;
        }
      }
    }
  }
  UsuarioTicket(OrdenTrabajoID) {
    if (this.incidentesUsuarioList) {
      for (let element of this.incidentesUsuarioList) {
        if (element.OrdenTrabajoID == OrdenTrabajoID) {
          return element.CodUsuario
        }
      }
    }
  }
  VisitasInstalacion(InstalacionID) {
    if (this.VisitasPorInstalacionList) {
      for (let element of this.VisitasPorInstalacionList) {
        if (element.InstalacionID == InstalacionID) {
          return element.count
        }
      }
    }
  }
  onMapReady(map): void {
    setTimeout(() => {
      map.invalidateSize();
    });
  }
  seleccionarfiltro(twe, te, t) { }
  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.division_seleccionada = params['division'];
      this.regional_seleccionada = params['regional'];
      this.RolUsuarioActual = params['usuario'];
      this.instalacion_seleccionada = params['instalacionid'];
      this.UsuarioActualID = params['usuarioid'];
      this.proyecto_seleccionado = params['proyectoid'];
    });

    this.queryLoopback = {
      order: 'fecha_inicio_plan DESC',
      where: {
        DivisionID: this.division_seleccionada,
        RegionID: this.regional_seleccionada,
        InstalacionID: this.instalacion_seleccionada,
        ProyectoID: this.proyecto_seleccionado,
        fecha_inicio_plan: {
          between: [
            moment(this.FechaSeleccionada).format('YYYY-MM-DD') +
            '00:00:00.000Z',
            moment(this.FechaSeleccionada).format('YYYY-MM-DD') +
            'T23:59:59.999Z',
          ],
        },
      },
    };

    this.HoraMetabase = moment(this.FechaSeleccionada.start_time).format(
      'YYYY-MM-DD'
    );
    await this.CargarRegionales()
    await this.CargarConfiguracion()
    this.CargarHaninProyectos();
    this.CargarHaninInstalaciones();
    this.CargarVisitas();
    this.CargarTareas();
    await this.CargarUsuariosPanelIzquierdo();
    this.Cargartickets();
    this.CargarHaninsupervisorUnaRegional();
    this.CargarContadorEntregas();
    this.CargarContadorEntregasFinalizadas();
  }

  ngAfterViewInit() {
    var Satelital = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ),
      Cartográfico = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        maxNativeZoom: 19,
        maxZoom: 21,
      });
    map = L.map('VistaMapa', {
      center: [0, 0],
      zoom: 3,
      gestureHandling: true,
      maxNativeZoom: 18,
    });
    L.control
      .layers(
        {
          Satelital: Satelital,
          Cartográfico: Cartográfico,
        },
        null,
        {
          collapsed: true,
        }
      )
      .addTo(map);
    Cartográfico.addTo(map);
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }
}

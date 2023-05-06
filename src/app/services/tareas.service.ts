import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  url = GlobalConstants.Loopback;
  port = GlobalConstants.LoopbackPort;

  coordenadas = this.socket.fromEvent<Document>('sincronizar');
  constructor(private http: HttpClient, private socket: Socket) { }
  headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
  });
  hanin_tareas_mapa_tiempo_reals_get(fecha, ProyectoID, InstalacionID) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"ProyectoID":"' +
      ProyectoID +
      '","InstalacionID":"' +
      InstalacionID +
      '","fecha_inicio_plan": {"between": ["' +
      Fecha +
      'T00:00:00.000Z","' +
      Fecha +
      'T23:59:59.999Z"]}}}';
    return this.http.get<any>(url_api).toPromise();
  }
  CargarTareasTodasRegional(fecha, Division) {
    let dia = moment(fecha.start_time).format('DD');
    let mes = moment(fecha.start_time).format('MM');
    let anio = moment(fecha.start_time).format('YYYY');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/CargarHanintareasmapatiemporealUnaRegional?DivisionID=' +
      Division +
      '&Anio=' +
      anio +
      '&Mes=' +
      mes +
      '&Dia=' +
      dia;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarTareasPorVisitas(VisitaID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/TareasPorVisita?VisitaID=' +
      VisitaID;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarFotosPorVisitas(VisitaID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/FotosPorVisita?VisitaID=' +
      VisitaID;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarGraficaInspeccion(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaIni,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/IndicadorTiempoInspeccion?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      moment(FechaIni).format('YYYY.MM.DD') +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarGraficaInstalacion(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaIni,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/IndicadorTiempoInstalacion?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      moment(FechaIni).format('YYYY.MM.DD') +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarGraficaCuardillas(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaIni,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/IndicadorTareasporCuadrilla?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      moment(FechaIni).format('YYYY.MM.DD') +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarIndicadorTiempoInstalacionOrdenes(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaIni,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/IndicadorC1?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      moment(FechaIni).format('YYYY.MM.DD') +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarIndicadorTiempoInstalacionOrdenesUltimos3(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaIni,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals/IndicadorC2?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      moment(FechaIni).format('YYYY.MM.DD') +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  hanin_tareas_mapa_tiempo_reals_get_actualizar() {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_tareas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"fecha_inicio_plan": {"between": ["2021-09-01T00:00:00.000Z","2021-09-01T23:59:59.999Z"]}}}';
    return this.http.get<any>(url_api).toPromise();
  }
  hanin_tareas_mapa_tiempo_reals_patch(data, id) {
    const url_api =
      this.url + ':' + this.port + '/api/hanin_tareas_mapa_tiempo_reals/' + id;
    return this.http
      .patch<any>(url_api, data, { headers: this.headers })
      .toPromise();
  }
}

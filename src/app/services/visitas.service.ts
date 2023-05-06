import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  url = GlobalConstants.Loopback;
  port = GlobalConstants.LoopbackPort;

  coordenadas = this.socket.fromEvent<Document>('sincronizar');
  constructor(private http: HttpClient, private socket: Socket) { }
  headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
  });

  hanin_visitas_mapa_tiempo_reals_get_count_finalizadas(
    fecha,
    CodUsuario,
    TipoOt
  ) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');
    if (TipoOt == 'Todos') {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_visitas_mapa_tiempo_reals/count?where={"CodUsuario":"' +
        CodUsuario +
        '","Estado":"Finalizado","fecha_inicio_plan": {"between": ["' +
        Fecha +
        'T00:00:00.000Z","' +
        Fecha +
        'T23:59:59.999Z"]}}';
      return this.http.get<any>(url_api).toPromise();
    } else {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_visitas_mapa_tiempo_reals/count?where={"CodUsuario":"' +
        CodUsuario +
        '","TipoOt":"' +
        TipoOt +
        '","Estado":"Finalizado","fecha_inicio_plan": {"between": ["' +
        Fecha +
        'T00:00:00.000Z","' +
        Fecha +
        'T23:59:59.999Z"]}}';
      return this.http.get<any>(url_api).toPromise();
    }
  }
  hanin_visitas_mapa_tiempo_reals_get_count(fecha, CodUsuario, TipoOt) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');
    if (TipoOt == 'Todos') {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_visitas_mapa_tiempo_reals/count?where={"CodUsuario":"' +
        CodUsuario +
        '","fecha_inicio_plan": {"between": ["' +
        Fecha +
        'T00:00:00.000Z","' +
        Fecha +
        'T23:59:59.999Z"]}}';

      return this.http.get<any>(url_api).toPromise();
    } else {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_visitas_mapa_tiempo_reals/count?where={"CodUsuario":"' +
        CodUsuario +
        '","TipoOt":"' +
        TipoOt +
        '","fecha_inicio_plan": {"between": ["' +
        Fecha +
        'T00:00:00.000Z","' +
        Fecha +
        'T23:59:59.999Z"]}}';
      return this.http.get<any>(url_api).toPromise();
    }
  }
  hanin_visitas_mapa_tiempo_reals_get(
    fecha,
    DivisionID,
    RegionID,
    InstalacionID,
    ProyectoID,
    TipoOt,
    Estado
  ) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');

    if (Estado == 'Todos') {
      if (TipoOt == 'Todos') {
        const url_api =
          this.url +
          ':' +
          this.port +
          '/api/hanin_visitas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"DivisionID":"' +
          DivisionID +
          '","InstalacionID":"' +
          InstalacionID +
          '","ProyectoID":"' +
          ProyectoID +
          '","fecha_inicio_plan": {"between": ["' +
          Fecha +
          'T00:00:00.000Z","' +
          Fecha +
          'T23:59:59.999Z"]}}}';
        return this.http.get<any>(url_api).toPromise();
      } else {
        const url_api =
          this.url +
          ':' +
          this.port +
          '/api/hanin_visitas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"DivisionID":"' +
          DivisionID +
          '","InstalacionID":"' +
          InstalacionID +
          '","ProyectoID":"' +
          ProyectoID +
          '","TipoOt":"' +
          TipoOt +
          '","fecha_inicio_plan": {"between": ["' +
          Fecha +
          'T00:00:00.000Z","' +
          Fecha +
          'T23:59:59.999Z"]}}}';

        return this.http.get<any>(url_api).toPromise();
      }
    } else {
      if (TipoOt == 'Todos') {
        const url_api =
          this.url +
          ':' +
          this.port +
          '/api/hanin_visitas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"DivisionID":"' +
          DivisionID +
          '","InstalacionID":"' +
          InstalacionID +
          '","ProyectoID":"' +
          ProyectoID +
          '","Estado":"' +
          Estado +
          '","fecha_inicio_plan": {"between": ["' +
          Fecha +
          'T00:00:00.000Z","' +
          Fecha +
          'T23:59:59.999Z"]}}}';
        return this.http.get<any>(url_api).toPromise();
      } else {
        const url_api =
          this.url +
          ':' +
          this.port +
          '/api/hanin_visitas_mapa_tiempo_reals?filter={"order":"fecha_inicio_plan DESC","where":{"DivisionID":"' +
          DivisionID +
          '","InstalacionID":"' +
          InstalacionID +
          '","ProyectoID":"' +
          ProyectoID +
          '","Estado":"' +
          Estado +
          '","TipoOt":"' +
          TipoOt +
          '","fecha_inicio_plan": {"between": ["' +
          Fecha +
          'T00:00:00.000Z","' +
          Fecha +
          'T23:59:59.999Z"]}}}';

        return this.http.get<any>(url_api).toPromise();
      }
    }
  }

  CargarIndicadorOrdenesCompletadas(
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
      '/api/hanin_visitas_mapa_tiempo_reals/IndicadorA1?DivisionID=' +
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
  CargarIndicadorOrdenesCompletadasUltimos3(
    DivisionID,
    RegionID,
    SupervisorID,
    FechaFin
  ) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/IndicadorA2?DivisionID=' +
      DivisionID +
      '&RegionID=' +
      RegionID +
      '&SupervisorID=' +
      SupervisorID +
      '&FechaIni=' +
      '&FechaFin=' +
      moment(FechaFin).format('YYYY.MM.DD');
    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarIndicadorOrdenesPendientes(
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
      '/api/hanin_visitas_mapa_tiempo_reals/IndicadorD1?DivisionID=' +
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
  CargarIndicadorOrdenesNoCompletadas(
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
      '/api/hanin_visitas_mapa_tiempo_reals/IndicadorD2?DivisionID=' +
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
  CargarDatosVisita(ot) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/TarjetaOt?Ot=' +
      ot;

    return this.http.get<any[]>(url_api).toPromise();
  }
  CargarDatosVisitaInstalacion(ot) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/TarjetaOtInstalacion?Ot=' +
      ot;
    return this.http.get<any[]>(url_api).toPromise();
  }
  hanin_visitas_mapa_tiempo_reals_get_actualizar(VisitaID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals?filter={"where":{"VisitaID":"' +
      VisitaID +
      '"}}';
    return this.http.get<any>(url_api).toPromise();
  }
  hanin_visitas_mapa_tiempo_reals_get_VisitasFinalizadas(InstalacionID, Fecha) {
    let dia = moment(Fecha).format('DD');
    let mes = moment(Fecha).format('MM');
    let anio = moment(Fecha).format('YYYY');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/VisitasFinalizadas?InstalacionID=' + InstalacionID + '&Anio=' + anio + '&Mes=' + mes + '&Dia=' + dia
    return this.http.get<any>(url_api).toPromise();
  }
  hanin_visitas_mapa_tiempo_reals_get_VisitasCreadas(InstalacionID, Fecha) {
    let dia = moment(Fecha).format('DD');
    let mes = moment(Fecha).format('MM');
    let anio = moment(Fecha).format('YYYY');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/VisitasCreadas?InstalacionID=' + InstalacionID + '&Anio=' + anio + '&Mes=' + mes + '&Dia=' + dia
    return this.http.get<any>(url_api).toPromise();
  }
  hanin_visitas_mapa_tiempo_reals_get_orderid(OrdenTrabajoID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals?filter={"fields":"CodUsuario","where":{"OrdenTrabajoID":"' +
      OrdenTrabajoID +
      '"}}';
    return this.http.get<any>(url_api).toPromise();
  }
  hanin_visitas_mapa_tiempo_reals_get_instalacionid(InstalacionID, fecha) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_visitas_mapa_tiempo_reals/count?where={"InstalacionID":"' + InstalacionID + '","fecha_inicio_plan":{"between":["' + Fecha + 'T00:00:00.000Z","' + Fecha + 'T23:59:59.999Z"]}}';
    return this.http.get<any>(url_api).toPromise();
  }
}

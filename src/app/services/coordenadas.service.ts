import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class CoordenadasService {
  url = GlobalConstants.Loopback;
  port = GlobalConstants.LoopbackPort;

  coordenadas = this.socket.fromEvent<Document>('sincronizar');
  constructor(private http: HttpClient, private socket: Socket) { }
  headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
  });


  CargarCoordenadasCliente(IdVisita) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/Clientes/CargarClienteUnaRegional?IdVisita=' +
      IdVisita;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarDatosClientePopUp(IdVisita) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/Clientes/CargarDatosClientePopUp?IdVisita=' +
      IdVisita;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarCuadrillasPanelIzquierdo(InstalacionID, TipoOt) {    
    if (TipoOt == 'Todos') {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_cuadrillas/CargarHanincuadrillaUnaRegionalTodos?InstalacionID=' +
        InstalacionID;

      return this.http.get<any>(url_api).toPromise();
    } else {
      const url_api =
        this.url +
        ':' +
        this.port +
        '/api/hanin_cuadrillas/CargarHanincuadrillaUnaRegional?InstalacionID=' +
        InstalacionID +
        '&TipoOt=' +
        TipoOt;
      return this.http.get<any>(url_api).toPromise();
    }
  }

  CargarHaninsupervisor(DivisionID, RegionalID, ProyectoID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_supervisors/CargarHaninsupervisor?DivisionID=' +
      DivisionID +
      '&RegionalID=' +
      RegionalID +
      '&ProyectoID=' +
      ProyectoID;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarHaninsupervisorUnaRegional(DivisionID, RegionalID, ProyectoID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_supervisors/CargarHaninsupervisorUnaRegional?DivisionID=' +
      DivisionID +
      '&RegionalID=' +
      RegionalID +
      '&ProyectoID=' +
      ProyectoID;
    return this.http.get<any>(url_api).toPromise();
  }


  CargarHaninproyectosUnaRegional(Usuario) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_instalaciones/CargarHaninproyectosUnaRegional?UsuarioID=' +
      Usuario;
    return this.http.get<any>(url_api).toPromise();
  }
  CargarHanininstalacionesUnaRegional(Division, Proyecto) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_instalaciones/CargarHanininstalacionesUnaRegional?DivisionID=' +
      Division +
      '&ProyectoID=' +
      Proyecto;
    return this.http.get<any>(url_api).toPromise();
  }
  GetSupervisorID(UsuarioActualID) {
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_supervisors?filter={"where":{"assigned_user_id":"86401E99-BAA9-4335-9A52-49DC8B4FBEE7"}}';
    return this.http.get<any>(url_api).toPromise();
  }
  ActualizarIncidenteEstado(OrdenTrabajoID, Estado) {
    var Incidente = {
      IdIncidente: OrdenTrabajoID,
      Estado: Estado,
    };
    const url_api =
      this.url + ':7011/api/incidentes-services/ActualizaIncidentes';
    return this.http.post<any>(url_api, Incidente).toPromise();
  }

  hanin_ordenestrabajos_get(fecha) {
    var Fecha = moment(fecha).format('YYYY-MM-DD');
    const url_api =
      this.url +
      ':' +
      this.port +
      '/api/hanin_ordenestrabajos?filter={"where":{"date_entered": {"between": ["' +
      Fecha +
      'T00:00:00.000Z","' +
      Fecha +
      'T23:59:59.999Z"]}}}';

    return this.http.get<any>(url_api).toPromise();
  }
  RegionesLocalizacion_get() {
    return this.http.get<any>('./assets/RegionesLocalizacion.json').toPromise();
  }
  Region_get() {
    return this.http.get<any>('./assets/Region.json').toPromise();
  }
  Configuracion_get() {
    return this.http.get<any>('./assets/Configuracion.json').toPromise();
  }
}
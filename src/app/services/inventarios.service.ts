import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  constructor(private http: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json",
  });
  hanin_inventariosinstalacion_get() {
    return this.http.get<any>("./assets/InventariosInstalacion.json").toPromise();
  }
  hanin_inventarioscuadrilla_get() {
    return this.http.get<any>("./assets/InventariosCuadrilla.json").toPromise();
  }
  
  hanin_inventariosingresos_get() {
    return this.http.get<any>("./assets/InventariosIngresos.json").toPromise();
  }
  hanin_inventariossolicitud_get() {
    return this.http.get<any>("./assets/InventariosSolicitud.json").toPromise();
  }
  hanin_inventariosdevolucion_get() {
    return this.http.get<any>("./assets/InventariosDevolucion.json").toPromise();
  }
  hanin_inventariostraslados_get() {
    return this.http.get<any>("./assets/InventariosCuadrilla.json").toPromise();
  }
}

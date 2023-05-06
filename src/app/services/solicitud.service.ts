import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json",
  });
  hanin_solicitud_get() {
    return this.http.get<any>("./assets/Solicitud.json").toPromise();
  }
}

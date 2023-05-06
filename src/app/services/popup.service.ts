import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  makeCapitalPopup(data: any): string {
    return `` +
    `<div>Capital: ${ data.properties.VisitaID }</div>` +
    `<div>State: ${ data.properties.cliente }</div>` 
  }
}
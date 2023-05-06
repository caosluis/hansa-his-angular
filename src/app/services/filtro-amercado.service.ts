import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltroAmercadoService {

  constructor() { }

  public FiltrosAmercado = [
  {
    AmercadoID:'01',
    Amercado:'Carrier',
    DivisionID:'06',
  },
  {
    AmercadoID:'02',
    Amercado:'Enterprise',
    DivisionID:'06',
  },
  {
    AmercadoID:'03',
    Amercado:'Gas & Oil',
    DivisionID:'06',
  },
  {
    AmercadoID:'04',
    Amercado:'Telecom Carrier',
    DivisionID:'06',
  }
]

  EnviarFiltrosAmercado(DivisionID){
    var FiltradoAmercado = this.FiltrosAmercado.filter((item)=>{return item.DivisionID ==DivisionID})
    return FiltradoAmercado
  }
}

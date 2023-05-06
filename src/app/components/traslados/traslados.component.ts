import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrasladoService } from 'src/app/services/traslado.service';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css'],
})
export class TrasladosComponent implements OnInit {
  TrasladosColumns: string[] = [
    'FechaSolicitud',
    'Observaciones',
    'Estado',
    'Origen',
    'Destino',
    'actions'
  ];
  TrasladosList: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private TrasladoService: TrasladoService) {}

  ngOnInit(): void {
    this.CargarSolicitudes();
  }
  CargarSolicitudes() {
    this.TrasladoService.hanin_traslado_get().then((data) => {
      this.TrasladosList = new MatTableDataSource(data);
      this.TrasladosList.paginator = this.paginator;
      this.TrasladosList.sort = this.sort;
    });
  }
}

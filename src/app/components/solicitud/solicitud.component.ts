import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudService } from 'src/app/services/solicitud.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
})
export class SolicitudComponent implements OnInit {
  SolicitudesColumns: string[] = [
    'FechaSolicitud',
    'Observaciones',
    'Estado',
    'actions'
  ];
  SolicitudesList: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private SolicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.CargarSolicitudes();
  }
  CargarSolicitudes() {
    this.SolicitudService.hanin_solicitud_get().then((data) => {
      this.SolicitudesList = new MatTableDataSource(data);
      this.SolicitudesList.paginator = this.paginator;
      this.SolicitudesList.sort = this.sort;
    });
  }
}

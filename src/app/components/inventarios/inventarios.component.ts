import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css'],
})
export class InventariosComponent implements OnInit {
  InventarioInstalacionColumns: string[] = [
    'NombreItem',
    'Cantidad',
    'CantidadUsado',
    'Fecha',
    'actions',
  ];
  InventarioCuadrillaColumns: string[] = [
    'NombreItem',
    'LibreDisponibilidad',
    'Ot',
    'Usado',
    'Ingreso',
    'FechaIngreso',
    'RecojoDevoluciones',
    'FechaDevoluciones',
    'Cuarentena',
    'FechaCuarentena',
    'actions',
  ];
  InventarioInstalacionList: MatTableDataSource<any>;
  InventarioCuadrillaList: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private InventariosService: InventariosService) {}

  ngOnInit(): void {
    this.CargarInventarioInstalacion();
    this.CargarInventarioCuadrilla();
  }
  FiltroInventarioInstalacion(filterValue: string) {
    this.InventarioInstalacionList.filter = filterValue.trim().toLowerCase();
    if (this.InventarioInstalacionList.paginator) {
      this.InventarioInstalacionList.paginator.firstPage();
    }
  }

  CargarInventarioInstalacion() {
    this.InventariosService.hanin_inventariosinstalacion_get().then((data) => {
      this.InventarioInstalacionList = new MatTableDataSource(data);
      this.InventarioInstalacionList.paginator = this.paginator;
      this.InventarioInstalacionList.sort = this.sort;
    });
  }
  CargarInventarioCuadrilla() {
    this.InventariosService.hanin_inventarioscuadrilla_get().then((data) => {
      this.InventarioCuadrillaList = new MatTableDataSource(data);
      this.InventarioCuadrillaList.paginator = this.paginator;
      this.InventarioCuadrillaList.sort = this.sort;
    });
  }
  RefreshInventarioInstalacion() {
    this.InventariosService.hanin_inventariosinstalacion_get().then((data) => {
      this.InventarioInstalacionList.data = data;
    });
  }
  RefreshInventarioCuadrilla() {
    this.InventariosService.hanin_inventarioscuadrilla_get().then((data) => {
      this.InventarioCuadrillaList.data = data;
    });
  }
}

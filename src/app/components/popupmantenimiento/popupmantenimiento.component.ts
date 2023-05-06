import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import { InventariosService } from 'src/app/services/inventarios.service';
import { GlobalConstants } from '../../common/global-constants';
import { VisitasService } from '../../services/visitas.service';
import { TareasService } from '../../services/tareas.service';
import { state, style, trigger } from '@angular/animations';

@Component({
  selector: 'app-popupmantenimiento',
  templateUrl: './popupmantenimiento.component.html',
  styleUrls: ['./popupmantenimiento.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('90', style({ transform: 'rotate(90deg)' })),
      state('180', style({ transform: 'rotate(180deg)' })),
      state('270', style({ transform: 'rotate(270deg)' })),
    ])
  ]
})
export class PopupmantenimientoComponent implements OnInit {
  state: string = 'default';
  url = GlobalConstants.Crm;
  @Input() data;
  /*   images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`); */
  closeResult: any = '';
  TareasPorVisitas: any;
  FotosPorVisitas: any;
  fecha_inicio_no_iniciado = '1899-01-01 00:00:00';
  fecha_final_no_iniciado = '1899-01-01 00:00:00';
  ImagenDocumento: any;
  Region: any

  displayedColumns: string[] = ['NombreItem', 'Usado'];
  InventarioInstalacionList: MatTableDataSource<any>;
  InventarioCuadrillaList: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private TareasService: TareasService,
    private CoordenadasService: CoordenadasService,
    private modalService: NgbModal
  ) {
    this.CoordenadasService.Region_get().then(data => {
      this.Region = data
    })
  }

  @ViewChild('p') public popover: NgbPopover;

  public open(): void {
    const isOpen = this.popover.isOpen();
    this.popover.close();
    setTimeout(() => {
      this.popover.open();
    }, 350);
  }

  public close(): void {
    this.popover.close();
  }

  CargarTareasPorVisitas() {
    this.TareasService.CargarTareasPorVisitas(this.data.VisitaID).then(
      (tarea) => {
        this.TareasPorVisitas = tarea;
      }
    );
  }

  CargarFotosPorVisitas() {
    this.TareasService.CargarFotosPorVisitas(this.data.VisitaID).then(
      (foto) => {
        this.FotosPorVisitas = foto;
      }
    );
  }

  CargarImagenDocumento(foto) {
    this.ImagenDocumento = foto;
  }


  TipoTrabajo() {
    for (let element of this.Region) {
      if (element.Region == this.data.Instalacion) {
        return "Instalación"
      } else {
        return "Mantenimiento"
      }

    }


  }

  open1(content1) {
    this.modalService
      .open(content1, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  rotate() {
    if (this.state == 'default') {
      this.state = '90'
    } else if (this.state == '90') {
      this.state = '180'
    } else if (this.state == '180') {
      this.state = '270'
    } else if (this.state == '270') {
      this.state = 'default'
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.CargarTareasPorVisitas();
    this.CargarFotosPorVisitas();
    /* this.CargarInventarioCuadrilla(); */
  }

  /* CargarInventarioCuadrilla() {
    this.InventariosService.hanin_inventarioscuadrilla_get().then((data) => {
      this.InventarioCuadrillaList = new MatTableDataSource(data);
      this.InventarioCuadrillaList.paginator = this.paginator;
      this.InventarioCuadrillaList.sort = this.sort;
    });
  } */
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import { GlobalConstants } from '../../common/global-constants';
import { TareasService } from '../../services/tareas.service';
import { VisitasService } from '../../services/visitas.service';

@Component({
  selector: 'app-tarjeta-visita',
  templateUrl: './tarjeta-visita.component.html',
  styleUrls: ['./tarjeta-visita.component.css'],
})
export class TarjetaVisitaComponent implements OnInit {
  url = GlobalConstants.Crm;
  /* @Input() data; */
  /*   images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`); */
  closeResult = '';
  data: any;

  TareasPorVisitas: any;
  FotosPorVisitas: any;
  fecha_inicio_no_iniciado = '1899-01-01 00:00:00';
  fecha_final_no_iniciado = '1899-01-01 00:00:00';
  ImagenDocumento: any;

  ot_seleccionada: any;
  fecha_inicio_real: any;
  CodUsuario: any;
  telefono_contacto: any;
  cliente: any;
  phone_office: any;
  Estado: any;
  description: any;
  zona_instalacion: any;
  tiposinstalaciones: any;
  billing_address_street: any;
  VisitaID: any;

  fecha_inicio_plan: any;
  fecha_final_plan: any;
  fecha_final_real: any;

  constructor(
    private CoordenadasService: CoordenadasService,
    private VisitasService: VisitasService,
    private TareasService: TareasService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) { }

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
  async CargarDatosOt() {
    await this.VisitasService.CargarDatosVisita(this.ot_seleccionada).then(
      (data) => {
        this.fecha_inicio_real = data[0].fecha_inicio_real;
        this.CodUsuario = data[0].CodUsuario;
        this.telefono_contacto = data[0].telefono_contacto;
        this.cliente = data[0].cliente;
        this.phone_office = data[0].phone_office;
        this.Estado = data[0].Estado;
        this.description = data[0].description;
        this.zona_instalacion = data[0].zona_instalacion;
        this.tiposinstalaciones = data[0].tiposinstalaciones;
        this.billing_address_street = data[0].billing_address_street;
        this.VisitaID = data[0].VisitaID;
        this.data = data[0];
      }
    );
  }

  CargarTareasPorVisitas() {
    this.TareasService.CargarTareasPorVisitas(this.VisitaID).then(
      (tarea) => {
        this.TareasPorVisitas = tarea;
      }
    );
  }

  CargarFotosPorVisitas() {
    this.TareasService.CargarFotosPorVisitas(this.VisitaID).then(
      (foto) => {
        this.FotosPorVisitas = foto;
      }
    );
  }

  CargarImagenDocumento(foto) {
    this.ImagenDocumento = foto;
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

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.ot_seleccionada = params['ot'];
    });
    await this.CargarDatosOt();
    this.CargarTareasPorVisitas();
    this.CargarFotosPorVisitas();
  }

  async ngAfterViewInit() { }
}

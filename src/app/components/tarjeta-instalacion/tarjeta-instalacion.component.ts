import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Visitas } from 'src/app/models/visitas';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import { GlobalConstants } from '../../common/global-constants';
import { TareasService } from '../../services/tareas.service';
import { VisitasService } from '../../services/visitas.service';

@Component({
  selector: 'app-tarjeta-instalacion',
  templateUrl: './tarjeta-instalacion.component.html',
  styleUrls: ['./tarjeta-instalacion.component.css']
})
export class TarjetaInstalacionComponent implements OnInit {

  url = GlobalConstants.Crm;
  /* @Input() data; */
  /*   images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`); */
  closeResult = '';
  public data;
  public ot_seleccionada;
  public TareasPorVisitas;
  public FotosPorVisitas;
  public fecha_inicio_no_iniciado = '1899-01-01 00:00:00';
  public fecha_final_no_iniciado = '1899-01-01 00:00:00';
  public ImagenDocumento;

  constructor(private CoordenadasService: CoordenadasService,
    private VisitasService: VisitasService,
    private TareasService: TareasService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute) { }

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
    await this.VisitasService.CargarDatosVisitaInstalacion(this.ot_seleccionada).then(
      (data) => {
        this.data = data[0];
        console.log(this.data);
        console.log(this.data.Ot);

      }
    )
  }

  CargarTareasPorVisitas() {
    this.TareasService.CargarTareasPorVisitas(this.data.VisitaID).then(
      (tarea) => {
        this.TareasPorVisitas = tarea;
        console.log(this.TareasPorVisitas);
      }
    );
  }

  CargarFotosPorVisitas() {
    this.TareasService.CargarFotosPorVisitas(this.data.VisitaID).then(
      (foto) => {
        this.FotosPorVisitas = foto;
        console.log(this.FotosPorVisitas);

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
    var url = new URL(document.URL);
    this.activatedRoute.queryParams.subscribe(params => {
      this.ot_seleccionada = params['ot'];
    });

    /* this.ot_seleccionada = url.searchParams.get('ot'); */
    await this.CargarDatosOt()
  }
  async ngAfterViewInit() {
    this.CargarTareasPorVisitas();
    this.CargarFotosPorVisitas();
  }
}

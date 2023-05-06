import { Component, Inject, OnInit, Optional } from '@angular/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as moment from 'moment';
import { Draggable } from 'leaflet';
import { CoordenadasService } from 'src/app/services/coordenadas.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitasService } from '../../services/visitas.service';
import { TareasService } from '../../services/tareas.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css'],
})
export class IndicadoresComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  FiltroCategory: FormGroup;
  HoraSeleccionada: any = { start_time: new Date() };
  /* console.log(moment.utc().toString()); */

  public division_seleccionada;
  public regional_seleccionada;
  public RolUsuarioActual;
  public UsuarioActualID;
  public proyecto_seleccionado;

  public FiltroSupervisor;
  public supervisor_seleccionado = [];

  public start;
  public end;
  chartinspecciones: any;
  chartinstalaciones: any;
  public OrdenesCompletadas;
  public EfectividadOrdenes;
  public TiempoInstalacionOrdenes;
  public OrdenesPendientes;

  public OrdenesCompletadasUltimos3;
  public EfectividadOrdenesUltimos3;
  public TiempoInstalacionOrdenesUltimos3;
  public OrdenesNoCompletadas;
  public FiltroRegionales = [
    {
      RegionalID: '01_01',
      Regional: 'La Paz',
    },
    {
      RegionalID: '02_02',
      Regional: 'Santa Cruz',
    },
    {
      RegionalID: '03_03',
      Regional: 'Cochabamba',
    },
    {
      RegionalID: '04_04',
      Regional: 'Tarija',
    },
    {
      RegionalID: '05_05',
      Regional: 'Pando',
    },
    {
      RegionalID: '06_06',
      Regional: 'Chuquisaca',
    },
    {
      RegionalID: '01_07',
      Regional: 'Potosí',
    },
    {
      RegionalID: '02_08',
      Regional: 'Beni',
    },
    {
      RegionalID: '07_09',
      Regional: 'Oruro',
    },
    {
      RegionalID: 'Todas',
      Regional: 'Todas',
    },
  ];

  constructor(
    private CoordenadasService: CoordenadasService,
    private VisitasService: VisitasService,
    private TareasService: TareasService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  async ngOnInit() {
    var url = new URL(document.URL);
    /* this.division_seleccionada = url.searchParams.get('division');
    this.regional_seleccionada = url.searchParams.get('regional');
    this.RolUsuarioActual = url.searchParams.get('usuario');
    this.UsuarioActualID = url.searchParams.get('usuarioid');
    this.proyecto_seleccionado = url.searchParams.get('proyectoid'); */

    this.activatedRoute.queryParams.subscribe(params => {
      this.division_seleccionada = params['division'];
      this.regional_seleccionada = params['regional'];
      this.RolUsuarioActual = params['usuario'];
      this.UsuarioActualID = params['usuarioid'];
      this.proyecto_seleccionado = this.data.proyecto;
    });

    this.FiltroCategory = this.fb.group({
      supervisorCategory: [null, Validators.required],
      regionalCategory: [null, Validators.required],
    });
  }
  async ngAfterViewInit() {
    await this.CargarHaninsupervisor();
    this.FiltroCategory.get('regionalCategory').setValue(
      this.regional_seleccionada
    );
    await this.GetSupervisorID();
    this.FiltroCategory.get('supervisorCategory').setValue(
      this.UsuarioActualID
    );
    this.GraficoInspecciones();
    this.GraficoInstalaciones();
    this.GraficoRRendimientoCuadrilla();
    this.cargarGraficoInspecciones();
    this.cargarGraficoInstalaciones();
    this.CargarIndicadorOrdenesCompletadas();
    this.CargarIndicadorTiempoInstalacionOrdenes();
    this.CargarIndicadorOrdenesPendientes();
    this.CargarIndicadorOrdenesCompletadasUltimos3();
    this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
    this.CargarIndicadorOrdenesPendientesNoCompletadas();
    this.start = this.HoraSeleccionada;
    this.end = this.HoraSeleccionada;

  }
  async GetSupervisorID() {
    /* this.supervisor_seleccionado =[] */
    await this.CoordenadasService.GetSupervisorID(this.UsuarioActualID).then(
      (data) => {
        this.UsuarioActualID = data[0].id;
        this.supervisor_seleccionado = [data[0].id]
      }
    );
  }
  GraficoInspecciones() {
    this.chartinspecciones = am4core.create('chartdiv', am4charts.XYChart);
    /*   var data = [];
    
    data=[{category:"Raina",open:"2",close: "2",max:"5",min:"0" },{category:"Raina",open:"5",close: "0",max:"5",min:"0"}]
 
    this.chartinspecciones.data = data; */
    var categoryAxis = this.chartinspecciones.xAxes.push(
      new am4charts.CategoryAxis()
    );
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 310;
    /* categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.inside = true;
    
    
    categoryAxis.renderer.labels.template.adapter.add("dx", function(dx, target) {
        return -target.maxRight / 2;
    }) */

    var valueAxis = this.chartinspecciones.yAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;

    var valueAxis = this.chartinspecciones.xAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.renderer.opposite = true;
    valueAxis.title.text = 'Inspecciones';

    var series = this.chartinspecciones.series.push(
      new am4charts.ColumnSeries()
    );
    series.dataFields.categoryX = 'category';
    series.dataFields.openValueY = 'open';
    series.dataFields.valueY = 'close';
    series.tooltipText = `Max: [bold]{max} min[/]
                          Promedio:[bold]{openValueY.value} min[/]
                          Min: [bold]{min} min[/]`;
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.columns.template.width = 0.01;
    series.tooltip.pointerOrientation = 'horizontal';

    var openBullet = series.bullets.create(am4charts.CircleBullet) as any;
    openBullet.locationY = 1;

    var valueAxis = this.chartinspecciones.yAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.min = 0;

    var closeBullet = series.bullets.create(am4charts.CircleBullet);

    closeBullet.fill = this.chartinspecciones.colors.getIndex(4);
    closeBullet.stroke = closeBullet.fill;

    this.chartinspecciones.cursor = new am4charts.XYCursor();
  }

  GraficoInstalaciones() {
    this.chartinstalaciones = am4core.create('chartdiv2', am4charts.XYChart);
    /*     var data = [];
    
    data=[{category:"Juan",open:"2",close: "2",max:"5",min:"1" },{category:"Juan",open:"5",close: "1",max:"5",min:"1"}]
 
    this.chartinstalaciones.data = data; */
    var categoryAxis = this.chartinstalaciones.xAxes.push(
      new am4charts.CategoryAxis()
    );
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 310;
    /* categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.inside = true;
    
    categoryAxis.renderer.labels.template.adapter.add("dx", function(dx, target) {
        return -target.maxRight / 2;
    }) */

    var valueAxis = this.chartinstalaciones.yAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;

    var valueAxis = this.chartinstalaciones.xAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.renderer.opposite = true;
    valueAxis.title.text = 'Instalaciones';

    var series = this.chartinstalaciones.series.push(
      new am4charts.ColumnSeries()
    );
    series.dataFields.categoryX = 'category';
    series.dataFields.openValueY = 'open';
    series.dataFields.valueY = 'close';
    series.tooltipText = `Max: [bold]{max} min[/]
                          Promedio:[bold]{openValueY.value} min[/]
                          Min: [bold]{min} min[/]`;
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.columns.template.width = 0.01;
    series.tooltip.pointerOrientation = 'horizontal';

    var openBullet = series.bullets.create(am4charts.CircleBullet) as any;
    openBullet.locationY = 1;

    var valueAxis = this.chartinstalaciones.yAxes.push(
      new am4charts.ValueAxis()
    );
    valueAxis.min = 0;

    var closeBullet = series.bullets.create(am4charts.CircleBullet);

    closeBullet.fill = this.chartinstalaciones.colors.getIndex(4);
    closeBullet.stroke = closeBullet.fill;

    this.chartinstalaciones.cursor = new am4charts.XYCursor();
  }
  async GraficoRRendimientoCuadrilla() {
    let chart = am4core.create('chartdiv3', am4charts.XYChart);
    await this.TareasService.CargarGraficaCuardillas(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      var datacuadrillas = [];
      data.forEach((element) => {
        if (element.tipotarea_c == 'Inspeccion') {
          datacuadrillas.push({
            user_name: element.user_name,
            Inspeccion: element.cantidad,
          });
        } else if (element.tipotarea_c == 'Instalacion') {
          datacuadrillas.push({
            user_name: element.user_name,
            Instalacion: element.cantidad,
          });
        }
      });
      chart.data = datacuadrillas;
      chart.invalidateRawData();
    });
    /* data=[{user_name: "toricarrillo73@gmail.com", Inspeccion: 10, tipotarea_c: "Inspeccion"},
    {user_name: "vidramos", Inspeccion: 19, tipotarea_c: "Inspeccion"},
    {user_name: "toricarrillo73@gmail.com", Instalacion: 2, tipotarea_c: "Instalacion"},
    {user_name: "vidramos", Instalacion: 11, tipotarea_c: "Instalacion"}] */

    /*     chart.data = [
      {
        user_name: 'Cuadrilla 1',
        Instalacion: 20,
      },
      {
        user_name: 'Cuadrilla 1',
        Inspeccion: 23,
      }
    ]; */

    // Create axes

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'user_name';
    categoryAxis.numberFormatter.numberFormat = '#';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.labels.template.fontSize = 10;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;
    valueAxis.title.text = 'Supervisor';
    /* valueAxis.title.fontWeight = 800; */

    // Create series
    function createSeries(field, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'user_name';
      series.name = name;
      series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;

      let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = '{valueX}';
      valueLabel.label.horizontalCenter = 'left';
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = '{name}';
      categoryLabel.label.horizontalCenter = 'right';
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color('#fff');
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }

    createSeries('Instalacion', 'Instalacion');
    createSeries('Inspeccion', 'Inspeccion');
  }

  async cargarGraficoInspecciones() {
    await this.TareasService.CargarGraficaInspeccion(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      var datainspeccion = [];
      data.forEach((element) => {
        for (let index = 0; index <= 1; index++) {
          if (index == 0) {
            datainspeccion.push({
              category: element.user_name,
              open: element.duracion_promedio,
              close: element.duracion_promedio,
              max: element.duracion_maxima,
              min: element.duracion_minima,
            });
          } else {
            datainspeccion.push({
              category: element.user_name,
              open: element.duracion_maxima,
              close: element.duracion_minima,
              max: element.duracion_maxima,
              min: element.duracion_minima,
            });
          }
        }
      });
      this.chartinspecciones.data = datainspeccion;
      this.chartinspecciones.invalidateRawData();
    });
  }

  async cargarGraficoInstalaciones() {
    await this.TareasService.CargarGraficaInstalacion(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      var datainstalacion = [];
      data.forEach((element) => {
        for (let index = 0; index <= 1; index++) {
          if (index == 0) {
            datainstalacion.push({
              category: element.user_name,
              open: element.duracion_promedio,
              close: element.duracion_promedio,
              max: element.duracion_maxima,
              min: element.duracion_minima,
            });
          } else {
            datainstalacion.push({
              category: element.user_name,
              open: element.duracion_maxima,
              close: element.duracion_minima,
              max: element.duracion_maxima,
              min: element.duracion_minima,
            });
          }
        }
      });
      this.chartinstalaciones.data = datainstalacion;
      this.chartinstalaciones.invalidateRawData();
    });
  }

  async CargarIndicadorOrdenesCompletadas() {
    await this.VisitasService.CargarIndicadorOrdenesCompletadas(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      this.OrdenesCompletadas = data[0].Completed;
      this.EfectividadOrdenes = data[0].CompletedPercentage;
    });
  }
  async CargarIndicadorOrdenesCompletadasUltimos3() {
    await this.VisitasService.CargarIndicadorOrdenesCompletadasUltimos3(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      this.OrdenesCompletadasUltimos3 = data[0].Completed;
      this.EfectividadOrdenesUltimos3 = data[0].CompletedPercentage;
    });
  }
  async CargarIndicadorTiempoInstalacionOrdenes() {
    await this.TareasService.CargarIndicadorTiempoInstalacionOrdenes(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      console.log(data);

      this.TiempoInstalacionOrdenes = data[0].duracion_promedio;
    });
  }
  async CargarIndicadorTiempoInstalacionOrdenesUltimos3() {
    await this.TareasService.CargarIndicadorTiempoInstalacionOrdenesUltimos3(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      this.TiempoInstalacionOrdenesUltimos3 = data[0].duracion_promedio;
    });
  }
  async CargarIndicadorOrdenesPendientes() {
    await this.VisitasService.CargarIndicadorOrdenesPendientes(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      this.OrdenesPendientes = data.length;
    });
  }
  async CargarIndicadorOrdenesPendientesNoCompletadas() {
    await this.VisitasService.CargarIndicadorOrdenesNoCompletadas(
      this.division_seleccionada,
      this.regional_seleccionada,
      this.supervisor_seleccionado.join("','"),
      moment(this.start).format('YYYY.MM.DD'),
      moment(this.end).format('YYYY.MM.DD')
    ).then((data) => {
      this.OrdenesNoCompletadas = data.length;
    });
  }

  async CargarHaninsupervisor() {
    await this.CoordenadasService.CargarHaninsupervisor(
      this.division_seleccionada,
      this.regional_seleccionada.join("','"),
      this.proyecto_seleccionado
    ).then((data) => {
      console.log(data);

      this.FiltroSupervisor = data;
      data.forEach((element) => {
        this.supervisor_seleccionado.push(element.id);
      });
    });
  }
  SeleccionarFecha(event) {
    if (event.target.ngControl.name == 'start') {
      if (event.value != null) {
        this.start = event.value;
      }
    } else {
      if (event.value != null) {
        this.end = event.value;
        this.GraficoInspecciones();
        this.GraficoInstalaciones();
        this.GraficoRRendimientoCuadrilla();
        this.cargarGraficoInspecciones();
        this.cargarGraficoInstalaciones();
        this.CargarIndicadorOrdenesCompletadas();
        this.CargarIndicadorTiempoInstalacionOrdenes();
        this.CargarIndicadorOrdenesPendientes();
        this.CargarIndicadorOrdenesCompletadasUltimos3();
        this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
        this.CargarIndicadorOrdenesPendientesNoCompletadas();
      }
    }
  }
  async SeleccionarRegion(event) {
    this.regional_seleccionada = [];
    if (event.value == 'Todas') {
      this.regional_seleccionada = [
        '01_01',
        '02_02',
        '03_03',
        '04_04',
        '05_05',
        '06_06',
        '01_07',
        '02_08',
        '07_09',
      ];
      await this.CargarHaninsupervisor();
      this.GraficoInspecciones();
      this.GraficoInstalaciones();
      this.GraficoRRendimientoCuadrilla();
      this.cargarGraficoInspecciones();
      this.cargarGraficoInstalaciones();
      this.CargarIndicadorOrdenesCompletadas();
      this.CargarIndicadorTiempoInstalacionOrdenes();
      this.CargarIndicadorOrdenesPendientes();
      this.CargarIndicadorOrdenesCompletadasUltimos3();
      this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
      this.CargarIndicadorOrdenesPendientesNoCompletadas();
    } else {
      this.regional_seleccionada.push(event.value);
      this.GraficoInspecciones();
      this.GraficoInstalaciones();
      this.GraficoRRendimientoCuadrilla();
      this.cargarGraficoInspecciones();
      this.cargarGraficoInstalaciones();
      this.CargarIndicadorOrdenesCompletadas();
      this.CargarIndicadorTiempoInstalacionOrdenes();
      this.CargarIndicadorOrdenesPendientes();
      this.CargarIndicadorOrdenesCompletadasUltimos3();
      this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
      this.CargarIndicadorOrdenesPendientesNoCompletadas();
    }
  }

  async SeleccionarSupervisor(event) {
    this.supervisor_seleccionado = [];
    if (event.value == 'Todos') {
      await this.CoordenadasService.CargarHaninsupervisor(
        this.division_seleccionada,
        this.regional_seleccionada,
        this.proyecto_seleccionado
      ).then((data) => {
        data.forEach((element) => {
          this.supervisor_seleccionado.push(element.id);
        });
      });
      this.GraficoInspecciones();
      this.GraficoInstalaciones();
      this.GraficoRRendimientoCuadrilla();
      this.cargarGraficoInspecciones();
      this.cargarGraficoInstalaciones();
      this.CargarIndicadorOrdenesCompletadas();
      this.CargarIndicadorTiempoInstalacionOrdenes();
      this.CargarIndicadorOrdenesPendientes();
      this.CargarIndicadorOrdenesCompletadasUltimos3();
      this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
      this.CargarIndicadorOrdenesPendientesNoCompletadas();
    } else {
      this.supervisor_seleccionado.push(event.value);
      this.GraficoInspecciones();
      this.GraficoInstalaciones();
      this.GraficoRRendimientoCuadrilla();
      this.cargarGraficoInspecciones();
      this.cargarGraficoInstalaciones();
      this.CargarIndicadorOrdenesCompletadas();
      this.CargarIndicadorTiempoInstalacionOrdenes();
      this.CargarIndicadorOrdenesPendientes();
      this.CargarIndicadorOrdenesCompletadasUltimos3();
      this.CargarIndicadorTiempoInstalacionOrdenesUltimos3();
      this.CargarIndicadorOrdenesPendientesNoCompletadas();
    }
  }
}

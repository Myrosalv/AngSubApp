import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataService } from 'app/shared/data.service';
import { increment } from 'app/store/actions';
import Chart from 'chart.js';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ValueModel } from '../model'

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  title: string = 'subscribe-app'
  message: string = 'hi'
  show_clear_btn: boolean = false

  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public main_graph;
  public button_text: string;
  public graph_data_values: number[] = []
  public graph_data_labels: number[] = []

  transactions$ = this.dataService.messages$.pipe(
    map(data => JSON.parse(data['data'])),
    catchError(e => { throw e }),
    tap({
      error: error => console.log("error 40 :>>", error),
      complete: () => console.log("completed, connection closed :>>",)
    })
  )

  storeObservable$: Observable<ValueModel>;
  values: ValueModel;

  constructor(public dataService: DataService, private store: Store<{ reducer: ValueModel }>) {
  }

  ngOnInit() {

    this.store.select('reducer').subscribe(data => {

      console.log('-----------------------------------------------------')
      console.log("data :>>", data)
      console.log('-----------------------------------------------------')

      this.values = data
    })

    //subscribe to websocket subject, first time it will create the connection
    this.transactions$.subscribe(
      data => {
        this.store.dispatch(increment({ value: { e: data?.e, p: data?.p } }))
        if (this.graph_data_values.length === 30) {
          this.graph_data_values = this.graph_data_values.slice(1, this.graph_data_values.length)
          this.graph_data_labels = this.graph_data_values.map((val, i) => i)
          this.main_graph.data.datasets[0].data = this.graph_data_values
          this.main_graph.update('active')
        }
        this.graph_data_values.push(+data?.p?.value)
        this.graph_data_labels.push(this.graph_data_values.length)
        this.main_graph.update()
      },
      error => console.log("error 140 :>>", error)
    )
    this.button_text = "SUBSCRIBE";
    this.chartColor = "#FFFFFF";

    this.canvas = document.getElementById("main_graph");
    this.ctx = this.canvas.getContext("2d");

    this.main_graph = new Chart(this.ctx, {
      type: 'line',

      data: {
        labels: this.graph_data_labels,
        datasets: [{
          borderColor: "#6bd098",
          backgroundColor: "#6bd098",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          data: this.graph_data_values
        }
        ]
      },
      options: {
        legend: {
          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "#ccc",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });

    this.dataService.connect()
  } 

  onClear() {
    this.graph_data_values = [];
    this.graph_data_labels = [];
    this.main_graph.data.datasets[0].data = []
    this.main_graph.update();
  }

  onSubscribe() {
    if (this.button_text === 'SUBSCRIBE') {
      this.dataService.sendMessage({ e: this.button_text })
    } else {
      this.dataService.sendMessage({ e: this.button_text })
      this.dataService.close()
    }
    this.button_text = this.button_text === 'SUBSCRIBE' ? 'UNSUBSCRIBE' : 'SUBSCRIBE';
  }

  increment(value) {

    console.log('-----------------------------------------------------')
    console.log("value :>>", value)
    console.log('-----------------------------------------------------')

    this.store.dispatch(value)
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, ChartConfiguration, ChartEvent } from 'chart.js';
import { Router } from '@angular/router';
import { Participation } from 'src/app/core/models/Participation';

interface ChartElement {
  index: number;
  datasetIndex: number;
}

interface Country {
  id: number;
  country: string;
  participations: Participation[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy  {
  public ctx: CanvasRenderingContext2D | null;
  public config: ChartConfiguration<'pie'>;
  public chartData: number[] = [];
  public chartDatalabels: string[] = [];
  public chartCountryIds: number[] = [];
  public nbJo: number;
  public nbCountries: number;
  public medals: number;
  private subscription: Subscription | undefined;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {
    this.ctx = null;
    this.config = {
      type: 'pie',
      options: {
        onClick: this.chartClickEvent.bind(this),
      },
      data: {
        labels: this.chartDatalabels,
        datasets: [
          {
            label: 'Nombre de médailles',
            data: this.chartData,
            borderWidth: 1,
            borderColor: 'grey',
            backgroundColor: [
              '#793D52',
              '#89A1DB',
              '#9780A1',
              '#BFE0F1',
              '#B8CBE7',
              '#956065',
            ],
          },
        ],
      },
    };
    this.nbJo = 0;
    this.nbCountries = 0;
    this.medals = 0;
  }

  ngOnInit(): void {
    this.subscription = this.olympicService
      .loadInitialData()
      .subscribe((value: Country[]) => {
        this.nbCountries = value.length;
        this.nbJo = value[0].participations.length;

        value.forEach((element: Country) => {
          this.chartDatalabels.push(element.country);
          this.chartCountryIds.push(element.id);
          this.medals = 0;

          if (element.participations) {
            element.participations.forEach((participation: Participation) => {
              this.medals += participation.medalsCount;
            });
          }
          this.chartData.push(this.medals);
        });

        this.ctx = (document.getElementById(
          'myChart'
        ) as HTMLCanvasElement).getContext('2d');
        if (this.ctx) {
          this.config.data.labels = this.chartDatalabels;
          this.config.data.datasets[0].data = this.chartData;

          const myChart = new Chart(this.ctx, this.config);
        }
      });
  }

  chartClickEvent(event: ChartEvent, chartElements: ChartElement[]): void {
    if (chartElements.length > 0) {
      const countryId = this.chartCountryIds[chartElements[0].index];
      this.router.navigate(['/country', countryId]);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('destroy appel')
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleComponent } from '../page-title/page-title.component';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {

  public ctx: CanvasRenderingContext2D | null;
  public config: ChartConfiguration<'line'>;
  public chartData: number[] = [];
  public chartDatalabels: number[] = [];
  public nbJo: number;
  public medails: number;
  public nbAthletes: number;
  public countryName: string;
  public idParameter: number;
  private subscription: Subscription;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {
    this.chartDatalabels = [];
    this.chartData = [];
    this.nbJo = 0;
    this.medails = 0;
    this.nbAthletes = 0;
    this.countryName = '';
    this.idParameter = 0;
    this.subscription = new Subscription();
    this.ctx = null;
    this.config = {
      type: 'line',
      options: {},
      data: {
        labels: this.chartDatalabels,
        datasets: [
          {
            label: 'Année',
            data: this.chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    // Souscription à paramMap qui renvoie un observable contenant tous les paramètres de notre route puis transforme
    // le paramètre id en nombre
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.idParameter = id;
      }
    });

    // Souscription à loadDataByCountryId qui renvoie un Observable contenant les infos d'un pays par rapport à son ID
    this.subscription = this.olympicService
      .loadDataByCountryId(this.idParameter)
      .subscribe({
        next: (value) => {
          this.nbJo = value.participations.length;
          this.countryName = value.country;
          value.participations.forEach((participation: Participation) => {
            this.chartDatalabels.push(participation.year);
            this.medails += participation.medalsCount;
            this.nbAthletes += participation.athleteCount;
            this.chartData.push(participation.medalsCount);
          });

          const canvas = document.getElementById('myChart') as HTMLCanvasElement;
          this.ctx = canvas.getContext('2d');
          if (this.ctx) {
            const myChart = new Chart(this.ctx, this.config);
          }
        },
      });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
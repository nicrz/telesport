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
    // Souscription à loadInitialData qui renvoie un Observable contenant les données du JSON olympic.json
    this.subscription = this.olympicService
      .loadInitialData()
      .subscribe((value: Country[]) => {
          // Calcule la taille du tableau afin de déterminer le nombre de pays + calcule la taille de la collection-
          // -participations du premier pays de la liste afin de déterminer le nombre de JO (sachant que chaque pays a 
          // -le même nombre de participations)
        this.nbCountries = value.length;
        this.nbJo = value[0].participations.length;
        // Parcoure le tableau des pays
        value.forEach((element: Country) => {
            // Pour chaque pays parcourus, on stocke son nom et on l'insère dans le tableau des labels de notre diagramme
            // On stocke également en parallèle chaque ID de pays dans un tableau afin de nous en resservir lors de l'action de clic
          this.chartDatalabels.push(element.country);
          this.chartCountryIds.push(element.id);
          this.medals = 0;
            // Pour chaque pays, on parcoure la collection participations et pour chaque participation, on implémente la-
            // -valeur de la variable medails avec l'addition des valeurs contenues dans medalsCount
          if (element.participations) {
            element.participations.forEach((participation: Participation) => {
              this.medals += participation.medalsCount;
            });
          }
          // On stocke le nombre total de médailles pour le pays dans le tableau des données de notre diagramme
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

  // Méthode appelée lorsqu'un clic est effectué sur le diagramme, prend en paramètre l'événement de clic et un tableau-
  // -chartElements qui représente les différentes tranches du diagramme
  chartClickEvent(event: ChartEvent, chartElements: ChartElement[]): void {
    if (chartElements.length > 0) {
       // Récupère l'ID du pays en fonction de l'index du tableau qui a été cliqué (ex : l'index 4 représentera le pays d'ID 5)
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

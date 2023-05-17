import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { Router } from '@angular/router';


interface ChartElement {
  index: number;
  datasetIndex: number;
}

interface Country {
  id: number;
  country: string;
  participations: Participation[];
}

interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public ctx : any;
  public config : any;
  public chartData : number[] = [];
  public chartDatalabels : string[] = [];
  public chartCountryIds : number[] = [];
  public nbJo : number;
  public nbCountries : number;
  public medails : number;
  private subscription: Subscription;


  constructor(private olympicService: OlympicService, private router: Router) {
    this.chartDatalabels = [];
    this.chartData = [];
    this.chartCountryIds = [];
    this.nbJo = 0;
    this.nbCountries = 0;
    this.medails = 0;
    this.subscription = new Subscription();

  }
  
  ngOnInit(){

    // Souscription à loadInitialData qui renvoie un Observable contenant les données du JSON olympic.json
    this.subscription =  this.olympicService.loadInitialData().subscribe({
      next: (
        value => {
          // Calcule la taille du tableau afin de déterminer le nombre de pays + calcule la taille de la collection-
          // -participations du premier pays de la liste afin de déterminer le nombre de JO (sachant que chaque pays a 
          // -le même nombre de participations)
          this.nbCountries = value.length;
          this.nbJo = value[0].participations.length;
          // Parcoure le tableau des pays
          value.forEach((element: Country) => {
            // Pour chaque pays parcourus, on stocke son nom et on l'insère dans le tableau des labels de notre diagramme
            // On stocke également en parallèle chaque ID de pays dans un tableau afin de nous en resservir lors de l'action de clic
            this.chartDatalabels.push(element.country)
            this.chartCountryIds.push(element.id)
            this.medails = 0;
            // Pour chaque pays, on parcoure la collection participations et pour chaque participation, on implémente la-
            // -valeur de la variable medails avec l'addition des valeurs contenues dans medalsCount
            if (element.participations){
              element.participations.forEach((participation: Participation) => {
                this.medails += participation.medalsCount;
              })
            }
            // On stocke le nombre total de médailles pour le pays dans le tableau des données de notre diagramme
            this.chartData.push(this.medails)
          })

          // Configuration du diagramme
          this.ctx = document.getElementById('myChart');
          this.config = {
            type : 'pie',
            options : {
              onClick: this.chartClickEvent.bind(this)
            },
            data : {
              labels : this.chartDatalabels,
              datasets : [{ 
                label: 'Nombre de médailles',
                data: this.chartData,
                borderWidth: 1,
                borderColor: 'grey',
                backgroundColor: ['#793D52', '#89A1DB', '#9780A1', '#BFE0F1', '#B8CBE7', '#956065']
            }],
            }
          }
          const myChart = new Chart(this.ctx, this.config);
        }
      )
    })
  }
  

  // Méthode appelée lorsqu'un clic est effectué sur le diagramme, prend en paramètre l'événement de clic et un tableau-
  // -chartElements qui représente les différentes tranches du diagramme
  chartClickEvent(event: MouseEvent, chartElements: ChartElement[]) {
    if (chartElements.length > 0) {
      // Récupère l'ID du pays en fonction de l'index du tableau qui a été cliqué (ex : l'index 4 représentera le pays d'ID 5)
      const countryId = this.chartCountryIds[chartElements[0].index];
      console.log(chartElements);
      this.router.navigate(['/country', countryId]);
    }
  }

  // Met fin à notre souscription
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}

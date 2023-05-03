import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})

//Duplication for now

export class CountryComponent implements OnInit {

  public ctx : any;
  public config : any;
  public chartData : number[] = [];
  public chartDatalabels : any[] = [];
  public nbJo : number;
  public nbCountries : number;
  public medails : number;


  constructor(private olympicService: OlympicService) {
    this.chartDatalabels = [];
    this.chartData = [];
    this.nbJo = 0;
    this.nbCountries = 0;
    this.medails = 0;

  }
  
  ngOnInit(){

    this.olympicService.loadInitialData().subscribe({
      next: (
        value => {
          this.nbCountries = value.length;
          this.nbJo = value[0].participations.length;
          value.forEach((element: any) => {
            this.chartDatalabels.push(element.country)
            this.medails = 0;
            if (element.participations){
              element.participations.forEach((participation: any) => {
                this.medails += participation.medalsCount;
              })
            }
            this.chartData.push(this.medails)
          })
  
          this.ctx = document.getElementById('myChart');
          this.config = {
            type : 'pie',
            options : {
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
  
}
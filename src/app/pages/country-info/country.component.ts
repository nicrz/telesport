import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})

export class CountryComponent implements OnInit {

  public ctx : any;
  public config : any;
  public chartData : number[] = [];
  public chartDatalabels : any[] = [];
  public nbJo : number;
  public medails : number;
  public nbAthletes : number;
  public countryName : string;
  public idParameter: number;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {
    this.chartDatalabels = [];
    this.chartData = [];
    this.nbJo = 0;
    this.medails = 0;
    this.nbAthletes = 0;
    this.countryName = '';
    this.idParameter = 0;

  }
  
  ngOnInit(){
    
      this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.idParameter = id;
      }
    }); 

    this.olympicService.loadDataByCountryId(this.idParameter).subscribe({
      next: (
        value => {
          this.nbJo = value.participations.length;
          this.countryName = value.country;
          value.participations.forEach((participation: any) => {
            this.chartDatalabels.push(participation.year)
            this.medails += participation.medalsCount;
            this.nbAthletes += participation.athleteCount;
            this.chartData.push(participation.medalsCount)
          })

          this.ctx = document.getElementById('myChart');
          this.config = {
            type : 'line',
            options : {
            },
            data : {
              labels : this.chartDatalabels,
              datasets : [{ 
                label: 'Année',
                data: this.chartData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }],
            }
          }
          const myChart = new Chart(this.ctx, this.config);
        }
      )
    })
  }
  
}
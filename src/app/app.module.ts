import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country-info/country.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { PageTitleComponent } from './pages/page-title/page-title.component';
Chart.register(...registerables);


@NgModule({
  declarations: [AppComponent, HomeComponent, CountryComponent, NotFoundComponent, PageTitleComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

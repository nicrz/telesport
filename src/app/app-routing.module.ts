import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country-info/country.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryIdGuard } from './country-id.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:id',
    component: CountryComponent,
    canActivate: [CountryIdGuard], // Utilise la garde de routage pour vérifier si l'ID existe
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**', 
    redirectTo: '/not-found', // Redirige vers NotFoundComponent pour toutes les autres routes inconnues
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

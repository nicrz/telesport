import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Injectable({
  providedIn: 'root'
})
export class CountryIdGuard implements CanActivate {
  constructor(private olympicService: OlympicService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const id = Number(route.paramMap.get('id')); // Récupère l'ID depuis la route et le convertit en nombre
  
    // Vérifie si l'ID existe en utilisant le service OlympicService (à adapter selon votre logique)
    const countryExists = await this.olympicService.countryExists(id);
  
    if (!countryExists) {
      // Redirige vers NotFoundComponent si l'ID n'existe pas
      this.router.navigate(['/not-found']);
      return false;
    }
  
    return true;
  }
  
}

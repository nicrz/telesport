import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  loadDataByCountryId(id: number) {
    return this.http.get<any>(this.olympicUrl).pipe(
      map(data => data.find((item: { id: number; }) => item.id === id)),
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  async countryExists(id: number): Promise<boolean> {
    try {
      const data = await firstValueFrom(this.loadDataByCountryId(id)); // Récupère les données correspondant à l'ID
      return !!data; // Retourne true si les données existent, false sinon
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}

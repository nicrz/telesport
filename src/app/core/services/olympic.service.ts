import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface OlympicData {
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

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicData[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  loadDataByCountryId(id: number) {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      map((data) => data.find((item: OlympicData) => item.id === id)),
      tap((value) => this.olympics$.next(value ? [value] : [])),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
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

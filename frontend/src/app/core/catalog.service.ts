import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaConPlatos, Plato } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private http: HttpClient) {}

  carta(): Observable<CategoriaConPlatos[]> {
    return this.http.get<CategoriaConPlatos[]>(`${environment.apiBaseUrl}/catalogo/carta`);
  }
  destacados(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${environment.apiBaseUrl}/catalogo/destacados`);
  }
}

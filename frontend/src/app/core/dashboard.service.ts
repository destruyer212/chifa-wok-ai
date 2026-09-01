import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardDTO } from './models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  resumen(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${environment.apiBaseUrl}/dashboard/resumen`);
  }
}

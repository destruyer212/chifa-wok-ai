import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VozResponse } from './models';

@Injectable({ providedIn: 'root' })
export class VoiceApiService {
  constructor(private http: HttpClient) {}

  /** Envia la transcripcion del Speech-to-Text al orquestador. */
  interpretar(transcripcion: string, sesionUuid?: string): Observable<VozResponse> {
    return this.http.post<VozResponse>(`${environment.apiBaseUrl}/voz/interpretar`, {
      transcripcion,
      sesionUuid,
      canalOrigen: 'widget-web',
    });
  }
}

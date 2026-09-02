import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VozResponse, ConfirmarResponse, ItemSugerido } from './models';

@Injectable({ providedIn: 'root' })
export class VoiceApiService {
  constructor(private http: HttpClient) {}

  private base = `${environment.apiBaseUrl}/voz`;

  /** Envia la transcripcion del Speech-to-Text al orquestador. */
  interpretar(transcripcion: string, sesionUuid?: string): Observable<VozResponse> {
    return this.http.post<VozResponse>(`${this.base}/interpretar`, {
      transcripcion,
      sesionUuid,
      canalOrigen: 'widget-web',
    });
  }

  /** Confirma el pedido: crea el cliente por telefono y registra el pedido. */
  confirmar(sesionUuid: string, telefono: string, items: ItemSugerido[],
            tipoEntrega: 'RECOJO' | 'DELIVERY' = 'RECOJO',
            direccion?: string, nombre?: string): Observable<ConfirmarResponse> {
    return this.http.post<ConfirmarResponse>(`${this.base}/confirmar`, {
      sesionUuid, telefono, nombre, tipoEntrega, direccion,
      items: items.map((i) => ({ codigoPlato: i.codigoPlato, cantidad: i.cantidad, presentacion: i.presentacion })),
    });
  }
}

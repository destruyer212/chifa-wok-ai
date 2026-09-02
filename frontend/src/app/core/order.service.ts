import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, EstadoPedido } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  private base = `${environment.apiBaseUrl}/pedidos`;

  tablero(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.base}/tablero`);
  }
  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.base}/${id}/estado`, { estado });
  }
  misPedidos(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.base}/cliente/${clienteId}`);
  }
  repetir(pedidoId: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.base}/${pedidoId}/repetir`, {});
  }
}

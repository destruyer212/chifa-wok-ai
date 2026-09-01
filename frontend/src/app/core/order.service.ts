import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, EstadoPedido } from './models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  tablero(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${environment.apiBaseUrl}/pedidos/tablero`);
  }
  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${environment.apiBaseUrl}/pedidos/${id}/estado`, { estado });
  }
}

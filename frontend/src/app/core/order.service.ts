import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Pedido, EstadoPedido } from './models';
import { AdminLocalService } from './admin-local.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = environment.apiBaseUrl + '/pedidos';
  constructor(private http: HttpClient, private local: AdminLocalService) {}
  tablero(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.base + '/tablero').pipe(
      tap((orders) => this.local.saveOrders(orders)),
      catchError(() => {
        const orders = this.local.orders();
        if (orders.length) return of(orders);
        const demo: Pedido = { id: 1001, codigo: 'CW-1001', clienteNombre: 'Mesa 4', canal: 'VOZ', estado: 'PENDIENTE', tipoEntrega: 'SALON', metodoPago: 'YAPE', subtotal: 47.8, costoEnvio: 0, descuento: 0, total: 47.8, creadoEn: new Date().toISOString(), items: [
          { id: 1, codigoPlato: 'CHF-001', nombrePlato: 'Arroz Chaufa Especial', cantidad: 1, precioUnitario: 24.9, subtotal: 24.9 },
          { id: 2, codigoPlato: 'POL-002', nombrePlato: 'Aeropuerto de Pollo', cantidad: 1, precioUnitario: 22.9, subtotal: 22.9 },
        ]};
        this.local.saveOrders([demo]); return of([demo]);
      }),
    );
  }
  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(this.base + '/' + id + '/estado', { estado }).pipe(tap(() => this.local.updateOrderStatus(id, estado)), catchError(() => of(this.local.updateOrderStatus(id, estado)!)));
  }
  misPedidos(clienteId: number): Observable<Pedido[]> { return this.http.get<Pedido[]>(this.base + '/cliente/' + clienteId); }
  repetir(pedidoId: number): Observable<Pedido> { return this.http.post<Pedido>(this.base + '/' + pedidoId + '/repetir', {}); }
}

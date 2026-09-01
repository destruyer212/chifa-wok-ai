import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/order.service';
import { EstadoPedido, Pedido } from '../../core/models';

@Component({
  selector: 'cw-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-md md:grid-cols-2 xl:grid-cols-3">
      <article *ngFor="let p of pedidos()"
               class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <div class="flex justify-between items-start mb-sm">
          <div>
            <p class="font-label-md text-label-md font-bold text-on-surface">{{ p.codigo }}</p>
            <p class="font-label-sm text-label-sm text-on-surface-variant">{{ p.clienteNombre }} · {{ p.canal }}</p>
          </div>
          <span class="font-label-sm text-label-sm px-sm py-xs rounded-full bg-secondary-container text-on-secondary-container">
            {{ p.estado }}
          </span>
        </div>
        <ul class="font-body-md text-body-md text-on-surface-variant mb-sm">
          <li *ngFor="let it of p.items">{{ it.cantidad }}× {{ it.nombrePlato }}</li>
        </ul>
        <p class="font-label-md text-label-md text-primary font-bold mb-sm">Total S/ {{ p.total | number: '1.2-2' }}</p>
        <div class="flex flex-wrap gap-xs">
          <button *ngFor="let e of siguientes(p.estado)" (click)="mover(p, e)"
                  class="font-label-sm text-label-sm px-sm py-xs rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors">
            {{ e }}
          </button>
        </div>
      </article>
      <p *ngIf="!pedidos().length" class="font-body-md text-on-surface-variant">No hay pedidos activos.</p>
    </div>
  `,
})
export class OrdersComponent {
  private readonly service = inject(OrderService);
  readonly pedidos = signal<Pedido[]>([]);

  private readonly flujo: EstadoPedido[] = [
    'PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO',
  ];

  constructor() { this.cargar(); }

  cargar(): void {
    this.service.tablero().subscribe({ next: (p) => this.pedidos.set(p) });
  }

  siguientes(estado: EstadoPedido): EstadoPedido[] {
    const i = this.flujo.indexOf(estado);
    const out: EstadoPedido[] = [];
    if (i >= 0 && i < this.flujo.length - 1) out.push(this.flujo[i + 1]);
    if (estado !== 'ENTREGADO' && estado !== 'CANCELADO') out.push('CANCELADO');
    return out;
  }

  mover(p: Pedido, estado: EstadoPedido): void {
    this.service.cambiarEstado(p.id, estado).subscribe({ next: () => this.cargar() });
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/order.service';
import { EstadoPedido, Pedido } from '../../core/models';

const COLUMNAS: { estado: EstadoPedido; label: string; icon: string }[] = [
  { estado: 'PENDIENTE', label: 'Pendientes', icon: 'schedule' },
  { estado: 'EN_PREPARACION', label: 'En preparacion', icon: 'skillet' },
  { estado: 'LISTO', label: 'Listos', icon: 'check_circle' },
  { estado: 'EN_CAMINO', label: 'En camino', icon: 'moped' },
];

@Component({
  selector: 'cw-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-md">
      <div><p class="font-label-sm text-primary font-bold">Panel operativo · Chifa Wok</p><p class="font-body-md text-body-md text-on-surface-variant">{{ pedidos().length }} pedidos activos · cocina en tiempo real</p></div>
      <div class="flex gap-sm"><span class="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm"><span class="w-2 h-2 rounded-full bg-green-600"></span>Recibiendo pedidos</span>
      <button (click)="cargar()" class="flex items-center gap-xs font-label-md text-label-md text-primary hover:underline">
        <span class="material-symbols-outlined text-[18px]">refresh</span> Actualizar
      </button></div>
    </div>

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-sm mb-md">
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md"><p class="font-label-sm text-on-surface-variant">Ventas del dia</p><p class="font-headline-md font-bold">S/ {{ totalVentas() | number:'1.2-2' }}</p><p class="font-label-sm text-secondary">+14% vs ayer</p></div>
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md"><p class="font-label-sm text-on-surface-variant">Pedidos totales</p><p class="font-headline-md font-bold">{{ pedidos().length }} ordenes</p><p class="font-label-sm text-tertiary">{{ vozCount() }} via Voice AI</p></div>
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md"><p class="font-label-sm text-on-surface-variant">Tiempo promedio Wok</p><p class="font-headline-md font-bold">8.5 min</p><p class="font-label-sm text-secondary">Excelente</p></div>
      <div class="bg-tertiary-fixed rounded-xl border border-tertiary-fixed-dim p-md"><p class="font-label-sm text-on-tertiary-fixed-variant">Eficiencia Voice AI</p><p class="font-headline-md font-bold text-on-tertiary-fixed-variant">98.2%</p><p class="font-label-sm text-on-tertiary-fixed-variant">Confirmados sin intervención</p></div>
    </div>

    <div class="grid gap-md md:grid-cols-2 xl:grid-cols-4">
      <section *ngFor="let col of columnas" class="bg-surface-container rounded-xl p-sm min-h-[120px] border-t-4" [class]="col.estado === 'PENDIENTE' ? 'border-secondary' : col.estado === 'EN_PREPARACION' ? 'border-primary' : col.estado === 'LISTO' ? 'border-green-600' : 'border-tertiary'">
        <header class="flex items-center gap-xs px-xs py-sm">
          <span class="material-symbols-outlined text-[18px] text-on-surface-variant">{{ col.icon }}</span>
          <span class="font-label-md text-label-md font-bold text-on-surface">{{ col.label }}</span>
          <span class="ml-auto font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant rounded-full px-sm">
            {{ porColumna()[col.estado].length }}
          </span>
        </header>

        <div class="space-y-sm">
          <article *ngFor="let p of porColumna()[col.estado]"
                   class="bg-surface-container-lowest rounded-lg border border-outline-variant p-sm">
            <div class="flex justify-between items-start">
              <p class="font-label-md text-label-md font-bold text-on-surface">{{ p.codigo }}</p>
              <span class="font-label-sm text-label-sm text-on-surface-variant">{{ p.creadoEn | date: 'HH:mm' }}</span>
            </div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-xs">{{ p.clienteNombre }} · {{ p.tipoEntrega }} · {{ p.canal }}</p>
            <ul class="font-body-md text-[14px] text-on-surface mb-xs">
              <li *ngFor="let it of p.items">{{ it.cantidad }}x {{ it.nombrePlato }}</li>
            </ul>
            <div class="flex justify-between items-center mb-sm"><p class="font-label-md text-label-md text-primary font-bold">S/ {{ p.total | number: '1.2-2' }}</p><span class="font-label-sm text-on-surface-variant">{{ p.metodoPago }}</span></div>
            <div class="flex flex-wrap gap-xs">
              <button *ngFor="let e of siguientes(p.estado)" (click)="mover(p, e)"
                      class="font-label-sm text-label-sm px-sm py-xs rounded-full transition-colors"
                      [class]="e === 'CANCELADO'
                        ? 'border border-error text-error hover:bg-error hover:text-on-error'
                        : 'bg-primary text-on-primary hover:opacity-90'">
                {{ etiqueta(e) }}
              </button>
            </div>
          </article>

          <p *ngIf="!porColumna()[col.estado].length" class="font-label-sm text-label-sm text-on-surface-variant px-xs py-md text-center">
            Sin pedidos
          </p>
        </div>
      </section>
    </div>

    <p *ngIf="!pedidos().length" class="font-body-md text-body-md text-on-surface-variant mt-lg text-center">
      No hay pedidos activos en este momento.
    </p>
  `,
})
export class OrdersComponent {
  private readonly service = inject(OrderService);
  readonly pedidos = signal<Pedido[]>([]);
  readonly columnas = COLUMNAS;
  readonly totalVentas = computed(() => this.pedidos().reduce((sum, p) => sum + p.total, 0));
  readonly vozCount = computed(() => this.pedidos().filter(p => p.canal === 'VOZ').length);

  private readonly flujo: EstadoPedido[] = [
    'PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO',
  ];

  readonly porColumna = computed(() => {
    const mapa: Record<string, Pedido[]> = {};
    for (const c of COLUMNAS) mapa[c.estado] = [];
    for (const p of this.pedidos()) {
      const dest = p.estado === 'CONFIRMADO' ? 'PENDIENTE' : p.estado;
      (mapa[dest] ??= []).push(p);
    }
    return mapa;
  });

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

  etiqueta(e: EstadoPedido): string {
    const map: Partial<Record<EstadoPedido, string>> = {
      CONFIRMADO: 'Confirmar', EN_PREPARACION: 'A cocina', LISTO: 'Listo',
      EN_CAMINO: 'Despachar', ENTREGADO: 'Entregado', CANCELADO: 'Cancelar',
    };
    return map[e] ?? e;
  }

  mover(p: Pedido, estado: EstadoPedido): void {
    this.service.cambiarEstado(p.id, estado).subscribe({ next: () => this.cargar() });
  }
}

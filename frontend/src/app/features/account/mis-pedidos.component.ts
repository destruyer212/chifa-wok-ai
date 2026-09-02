import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/order.service';
import { ClienteLocalService } from '../../core/cliente-local.service';
import { EstadoPedido, Pedido } from '../../core/models';
import { VoiceWidgetState } from '../voice-widget/voice-widget.state';

interface Paso { clave: string; label: string; icono: string; }

const PASOS: Paso[] = [
  { clave: 'recibido', label: 'Recibido', icono: 'check' },
  { clave: 'preparando', label: 'Preparando', icono: 'outdoor_grill' },
  { clave: 'camino', label: 'En camino', icono: 'moped' },
  { clave: 'entregado', label: 'Entregado', icono: 'home' },
];

const FINALES: EstadoPedido[] = ['ENTREGADO', 'CANCELADO'];

@Component({
  selector: 'cw-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="mb-lg">
      <h2 class="font-headline-lg text-headline-lg font-bold text-on-background">Mis Pedidos</h2>
    </header>

    <p *ngIf="cargando()" class="font-body-md text-on-surface-variant">Cargando tus pedidos...</p>

    <!-- Sin cliente / sin pedidos -->
    <div *ngIf="!cargando() && !pedidos().length"
         class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg text-center">
      <span class="material-symbols-outlined text-5xl text-on-surface-variant">receipt_long</span>
      <p class="font-body-md text-body-md text-on-surface-variant mt-sm mb-md">Aun no has hecho ningun pedido.</p>
      <div class="flex gap-sm justify-center">
        <a routerLink="/carta" class="bg-surface-container-highest text-primary font-label-md px-md py-sm rounded-lg">Ver la carta</a>
        <button (click)="widget.abrir()" class="bg-primary text-on-primary font-label-md px-md py-sm rounded-lg">Pedir por voz</button>
      </div>
    </div>

    <!-- Pedido activo -->
    <section *ngIf="activo() as a" class="mb-xl">
      <h3 class="font-headline-md text-headline-md font-bold mb-md">Pedido Activo</h3>
      <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div class="p-md border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">Pedido {{ a.codigo }}</p>
            <p class="font-label-md text-label-md font-bold">{{ a.tipoEntrega === 'DELIVERY' ? 'Delivery' : 'Recojo en tienda' }} · {{ a.canal }}</p>
          </div>
          <div class="bg-secondary-fixed px-sm py-xs rounded-full">
            <span class="font-label-sm text-label-sm text-on-secondary-fixed-variant font-bold">{{ etiquetaEstado(a.estado) }}</span>
          </div>
        </div>

        <!-- Status tracker -->
        <div class="p-md bg-surface-bright border-b border-outline-variant">
          <div class="flex items-center justify-between relative max-w-2xl mx-auto py-sm">
            <div class="absolute top-1/2 left-0 w-full h-1 bg-surface-container -translate-y-1/2 z-0 rounded-full">
              <div class="h-full bg-tertiary-container rounded-full transition-all"
                   [style.width.%]="(paso(a.estado) / (PASOS.length - 1)) * 100"></div>
            </div>
            <div *ngFor="let s of PASOS; let i = index" class="relative z-10 flex flex-col items-center gap-xs">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   [class]="i <= paso(a.estado)
                     ? 'bg-tertiary-container text-on-tertiary' + (i === paso(a.estado) ? ' ring-4 ring-tertiary-fixed' : '')
                     : 'bg-surface-container text-on-surface-variant'">
                <span class="material-symbols-outlined text-[16px]">{{ s.icono }}</span>
              </div>
              <span class="font-label-sm text-label-sm hidden sm:block"
                    [class]="i === paso(a.estado) ? 'text-on-background font-bold' : 'text-on-surface-variant'">
                {{ s.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detalle -->
        <div class="p-md flex flex-col md:flex-row gap-gutter">
          <div class="flex-1 space-y-sm">
            <div *ngFor="let it of a.items" class="flex items-center gap-md p-sm hover:bg-surface-container-low rounded-lg transition-colors">
              <div class="w-16 h-16 rounded-md bg-surface-container-high flex items-center justify-center border border-outline-variant shadow-sm text-secondary-container">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 28px;">lunch_dining</span>
              </div>
              <div class="flex-1">
                <p class="font-label-md text-label-md font-bold">{{ it.nombrePlato }}</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant">Cant: {{ it.cantidad }}</p>
              </div>
              <p class="font-label-md text-label-md font-bold">S/ {{ it.subtotal | number: '1.2-2' }}</p>
            </div>
          </div>

          <div class="md:w-64 bg-surface-container-low p-md rounded-lg h-fit border border-outline-variant">
            <p class="font-label-md text-label-md font-bold mb-sm border-b border-outline-variant pb-xs">Resumen del Pedido</p>
            <div class="flex justify-between mb-xs">
              <span class="font-label-sm text-label-sm text-on-surface-variant">Subtotal</span>
              <span class="font-label-sm text-label-sm">S/ {{ a.subtotal | number: '1.2-2' }}</span>
            </div>
            <div class="flex justify-between mb-xs" *ngIf="a.costoEnvio">
              <span class="font-label-sm text-label-sm text-on-surface-variant">Envio y comisiones</span>
              <span class="font-label-sm text-label-sm">S/ {{ a.costoEnvio | number: '1.2-2' }}</span>
            </div>
            <div class="flex justify-between mb-xs" *ngIf="a.descuento">
              <span class="font-label-sm text-label-sm text-on-surface-variant">Descuento</span>
              <span class="font-label-sm text-label-sm">- S/ {{ a.descuento | number: '1.2-2' }}</span>
            </div>
            <div class="flex justify-between border-t border-outline-variant pt-xs mt-sm">
              <span class="font-label-md text-label-md font-bold">Total</span>
              <span class="font-label-md text-label-md font-bold text-primary">S/ {{ a.total | number: '1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Historial -->
    <section *ngIf="historial().length">
      <h3 class="font-headline-md text-headline-md font-bold mb-md">Historial de Pedidos</h3>
      <div class="space-y-sm">
        <div *ngFor="let p of historial()"
             class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md hover:shadow-md transition-shadow">
          <div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">{{ p.creadoEn | date: 'd MMM, y' }} · {{ p.codigo }}</p>
            <p class="font-label-md text-label-md font-bold">{{ resumenItems(p) }}</p>
            <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">{{ etiquetaEstado(p.estado) }}</p>
          </div>
          <div class="flex items-center gap-md w-full md:w-auto justify-end">
            <p class="font-label-md text-label-md font-bold">S/ {{ p.total | number: '1.2-2' }}</p>
            <button (click)="repetir(p)" [disabled]="repitiendo() === p.id"
                    class="bg-surface-container-highest text-on-surface font-label-md px-md py-sm rounded-lg hover:bg-outline-variant transition-colors flex items-center gap-xs disabled:opacity-50">
              <span class="material-symbols-outlined text-[18px]">replay</span>
              {{ repitiendo() === p.id ? 'Creando...' : 'Repetir Pedido' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class MisPedidosComponent {
  private readonly orders = inject(OrderService);
  private readonly clienteLocal = inject(ClienteLocalService);
  readonly widget = inject(VoiceWidgetState);

  readonly PASOS = PASOS;
  readonly pedidos = signal<Pedido[]>([]);
  readonly cargando = signal(true);
  readonly repitiendo = signal<number | null>(null);

  readonly activo = computed(() => this.pedidos().find((p) => !FINALES.includes(p.estado)) ?? null);
  readonly historial = computed(() => this.pedidos().filter((p) => FINALES.includes(p.estado)));

  constructor() { this.cargar(); }

  private cargar(): void {
    const id = this.clienteLocal.clienteId();
    if (!id) { this.cargando.set(false); return; }
    this.orders.misPedidos(id).subscribe({
      next: (p) => { this.pedidos.set(p); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  paso(estado: EstadoPedido): number {
    switch (estado) {
      case 'EN_PREPARACION': return 1;
      case 'LISTO':
      case 'EN_CAMINO': return 2;
      case 'ENTREGADO': return 3;
      default: return 0; // PENDIENTE, CONFIRMADO, BORRADOR
    }
  }

  etiquetaEstado(e: EstadoPedido): string {
    const map: Record<EstadoPedido, string> = {
      BORRADOR: 'Borrador', PENDIENTE: 'Pendiente', CONFIRMADO: 'Confirmado',
      EN_PREPARACION: 'En preparacion', LISTO: 'Listo', EN_CAMINO: 'En camino',
      ENTREGADO: 'Entregado', CANCELADO: 'Cancelado',
    };
    return map[e];
  }

  resumenItems(p: Pedido): string {
    return p.items.map((i) => i.nombrePlato).join(', ');
  }

  repetir(p: Pedido): void {
    this.repitiendo.set(p.id);
    this.orders.repetir(p.id).subscribe({
      next: () => { this.repitiendo.set(null); this.cargar(); },
      error: () => this.repitiendo.set(null),
    });
  }
}

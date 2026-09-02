import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/dashboard.service';
import { DashboardDTO } from '../../core/models';

@Component({
  selector: 'cw-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="data() as d; else cargando">
      <!-- KPIs -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        <div *ngFor="let k of kpis()" class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <div class="flex items-center gap-sm mb-sm">
            <span class="w-9 h-9 rounded-lg flex items-center justify-center {{ k.bg }} {{ k.fg }}">
              <span class="material-symbols-outlined text-[20px] fill-icon">{{ k.icon }}</span>
            </span>
            <p class="font-label-sm text-label-sm text-on-surface-variant">{{ k.label }}</p>
          </div>
          <p class="font-display-lg text-[30px] font-bold text-on-surface leading-none">{{ k.valor }}</p>
          <p *ngIf="k.pie" class="font-label-sm text-label-sm text-on-surface-variant mt-xs">{{ k.pie }}</p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-md">
        <!-- Ventas 7 dias -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <h2 class="font-headline-md text-headline-md text-on-surface mb-md">Ventas de los ultimos 7 dias</h2>
          <div *ngIf="d.ventas7dias.length; else sinVentas" class="space-y-sm">
            <div *ngFor="let v of d.ventas7dias" class="flex items-center gap-sm">
              <span class="font-label-sm text-label-sm text-on-surface-variant w-16 shrink-0">{{ v.fecha | date: 'dd MMM' }}</span>
              <div class="flex-1 h-6 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full transition-all"
                     [style.width.%]="pct(v.totalVendido)"></div>
              </div>
              <span class="font-label-md text-label-md font-bold text-on-surface w-24 text-right shrink-0">S/ {{ v.totalVendido | number: '1.2-2' }}</span>
            </div>
          </div>
          <ng-template #sinVentas>
            <p class="font-body-md text-body-md text-on-surface-variant">Aun no hay ventas registradas (pedidos en estado ENTREGADO).</p>
          </ng-template>
        </section>

        <!-- Top platos -->
        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <h2 class="font-headline-md text-headline-md text-on-surface mb-md">Platos mas vendidos</h2>
          <ol *ngIf="d.topPlatos.length; else sinPlatos" class="space-y-xs">
            <li *ngFor="let p of d.topPlatos; let i = index"
                class="flex items-center gap-sm py-xs border-b border-outline-variant last:border-0">
              <span class="w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0"
                    [class]="i === 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'">
                {{ i + 1 }}
              </span>
              <span class="flex-1 font-body-md text-body-md text-on-surface truncate">{{ p.nombre }}</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">{{ p.unidades }} u.</span>
              <span class="font-label-md text-label-md font-bold text-primary w-24 text-right">S/ {{ p.ingresos | number: '1.2-2' }}</span>
            </li>
          </ol>
          <ng-template #sinPlatos>
            <p class="font-body-md text-body-md text-on-surface-variant">Todavia no hay platos vendidos.</p>
          </ng-template>
        </section>
      </div>
    </ng-container>

    <ng-template #cargando>
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-md">
        <div *ngFor="let _ of [1,2,3,4]" class="h-28 rounded-xl bg-surface-container animate-pulse"></div>
      </div>
    </ng-template>
  `,
})
export class DashboardComponent {
  private readonly service = inject(DashboardService);
  readonly data = signal<DashboardDTO | null>(null);

  readonly kpis = computed(() => {
    const d = this.data();
    if (!d) return [];
    const r = d.resumen;
    return [
      { label: 'Pedidos hoy', valor: r.pedidosHoy, icon: 'receipt_long', bg: 'bg-primary-fixed', fg: 'text-primary', pie: '' },
      { label: 'En preparacion', valor: r.pedidosEnPreparacion, icon: 'skillet', bg: 'bg-secondary-container', fg: 'text-on-secondary-container', pie: 'en cocina ahora' },
      { label: 'Ventas hoy', valor: 'S/ ' + r.ventasHoy.toFixed(2), icon: 'payments', bg: 'bg-primary-fixed', fg: 'text-primary', pie: '' },
      { label: 'Conversion voz', valor: r.tasaConversionVozPct + '%', icon: 'graphic_eq', bg: 'bg-tertiary-fixed', fg: 'text-tertiary', pie: r.sesionesVozHoy + ' sesiones hoy' },
    ];
  });

  readonly maxVenta = computed(() =>
    Math.max(1, ...(this.data()?.ventas7dias ?? []).map((v) => v.totalVendido)));

  constructor() {
    this.service.resumen().subscribe({ next: (d) => this.data.set(d) });
  }

  pct(v: number): number {
    return Math.round((v / this.maxVenta()) * 100);
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/dashboard.service';
import { DashboardDTO } from '../../core/models';

@Component({
  selector: 'cw-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="data() as d; else cargando">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <p class="font-label-sm text-label-sm text-on-surface-variant">Pedidos hoy</p>
          <p class="font-display-lg text-[32px] font-bold text-on-surface">{{ d.resumen.pedidosHoy }}</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <p class="font-label-sm text-label-sm text-on-surface-variant">En preparación</p>
          <p class="font-display-lg text-[32px] font-bold text-secondary">{{ d.resumen.pedidosEnPreparacion }}</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <p class="font-label-sm text-label-sm text-on-surface-variant">Ventas hoy</p>
          <p class="font-display-lg text-[32px] font-bold text-primary">S/ {{ d.resumen.ventasHoy | number: '1.2-2' }}</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
          <p class="font-label-sm text-label-sm text-on-surface-variant">Conversión voz</p>
          <p class="font-display-lg text-[32px] font-bold text-tertiary">{{ d.resumen.tasaConversionVozPct }}%</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-sm">Platos más vendidos</h2>
        <table class="w-full font-body-md text-body-md">
          <tbody>
            <tr *ngFor="let p of d.topPlatos" class="border-b border-outline-variant last:border-0">
              <td class="py-sm text-on-surface">{{ p.nombre }}</td>
              <td class="py-sm text-right text-on-surface-variant">{{ p.unidades }} u.</td>
              <td class="py-sm text-right text-primary font-semibold">S/ {{ p.ingresos | number: '1.2-2' }}</td>
            </tr>
            <tr *ngIf="!d.topPlatos.length"><td class="py-sm text-on-surface-variant">Sin datos todavía</td></tr>
          </tbody>
        </table>
      </div>
    </ng-container>
    <ng-template #cargando><p class="font-body-md text-on-surface-variant">Cargando métricas…</p></ng-template>
  `,
})
export class DashboardComponent {
  private readonly service = inject(DashboardService);
  readonly data = signal<DashboardDTO | null>(null);

  constructor() {
    this.service.resumen().subscribe({ next: (d) => this.data.set(d) });
  }
}

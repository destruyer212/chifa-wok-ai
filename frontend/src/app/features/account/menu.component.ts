import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../core/catalog.service';
import { CategoriaConPlatos, Plato } from '../../core/models';
import { VoiceWidgetState } from '../voice-widget/voice-widget.state';

const IMG_FALLBACK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBXcYkapB0RhLU731ZyVOd_ACeRQvOWc3LnBGIvFMQXtE93VjDG1RJsAW8N2B8pI-d_EdelRiOhZcIakxiwXkzxfL9e5MDc-CW5q3Ooi6DnJq8KD90BGRks7784O3o_wPwz8zGbgb6eN63KlVOrI7jtF4T3HgMHJ7vtVb3dCoEN4z9-cgd-mlfzBxeYvAPhWnh48T4U4f1cJ4coHlqpkFOSeu7A6PUYenCZDMM604olLbQuJquIqq9NCQ';

@Component({
  selector: 'cw-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Selector de categorias -->
    <div class="flex gap-4 overflow-x-auto pb-4 mb-lg">
      <button (click)="filtro.set(null)"
              class="px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors"
              [class]="filtro() === null
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'">
        Todas
      </button>
      <button *ngFor="let c of categorias()" (click)="filtro.set(c.nombre)"
              class="px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors"
              [class]="filtro() === c.nombre
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'">
        {{ c.nombre }}
      </button>
    </div>

    <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-md">
      {{ filtro() ?? 'Menu Completo' }}
    </h2>

    <p *ngIf="cargando()" class="font-body-md text-on-surface-variant">Cargando la carta...</p>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
      <article *ngFor="let p of visibles()"
               class="bg-surface rounded-xl overflow-hidden shadow-sm border border-surface-container-highest hover:shadow-md transition-shadow flex flex-col">
        <div class="w-full h-48 bg-cover bg-center bg-surface-container-high" [style.background-image]="bg(p)"></div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex justify-between items-start mb-2 gap-2">
            <h3 class="font-headline-md text-[18px] leading-tight text-on-surface">{{ p.nombre }}</h3>
            <span class="font-label-md text-label-md text-primary font-bold whitespace-nowrap">S/ {{ p.precio | number: '1.0-0' }}</span>
          </div>
          <p class="font-body-md text-[14px] text-on-surface-variant mb-4 flex-1">{{ p.descripcion }}</p>
          <button (click)="widget.abrir()"
                  class="w-full py-2 bg-surface-container-highest text-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed transition-colors">
            Agregar al Pedido
          </button>
        </div>
      </article>
    </div>

    <p *ngIf="!cargando() && !visibles().length" class="font-body-md text-on-surface-variant mt-md">
      No hay platos en esta categoria.
    </p>
  `,
})
export class MenuComponent {
  private readonly catalogo = inject(CatalogService);
  readonly widget = inject(VoiceWidgetState);

  readonly categorias = signal<CategoriaConPlatos[]>([]);
  readonly cargando = signal(true);
  readonly filtro = signal<string | null>(null);

  readonly visibles = computed<Plato[]>(() => {
    const cats = this.categorias();
    const f = this.filtro();
    return cats
      .filter((c) => !f || c.nombre === f)
      .flatMap((c) => c.platos);
  });

  constructor() {
    this.catalogo.carta().subscribe({
      next: (c) => { this.categorias.set(c); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  bg(p: Plato): string {
    return `url('${p.imagenUrl || IMG_FALLBACK}')`;
  }
}

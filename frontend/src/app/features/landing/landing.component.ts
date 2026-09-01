import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Plato } from '../../core/models';

@Component({
  selector: 'cw-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-surface shadow-sm sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto h-20">
        <a class="text-headline-md font-headline-md font-bold text-primary" href="#">Chifa Wok</a>
        <div class="flex items-center gap-sm">
          <a href="#carta" class="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Carta</a>
          <a routerLink="/ingresar" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Panel</a>
          <button class="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-full font-bold hover:opacity-90 transition-opacity">
            Pide Ahora
          </button>
        </div>
      </div>
    </nav>

    <section class="relative w-full min-h-[560px] flex items-center overflow-hidden bg-surface-container-low">
      <div class="relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full py-xl">
        <div class="max-w-2xl">
          <span class="inline-block bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-semibold mb-sm">
            Integración de IA de Voz
          </span>
          <h1 class="font-display-lg text-display-lg text-on-background mb-md">Pide tu Chifa favorito con la voz</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl">
            Tecnología Voice AI para una experiencia sin esperas. Habla con naturalidad
            y empezamos a cocinar. Pedidos rápidos, precisos y deliciosos.
          </p>
          <button class="bg-tertiary-container text-on-tertiary font-label-md text-label-md px-lg py-md rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-sm">
            <span class="material-symbols-outlined">settings_voice</span>
            <span class="font-bold">Probar Asistente de Voz</span>
          </button>
        </div>
      </div>
    </section>

    <section id="carta" class="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      <div class="text-center mb-xl">
        <h2 class="font-headline-lg text-headline-lg text-on-background mb-sm">Platos Estrella</h2>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
          Fusión peruano-china preparada al wok. Estos son los favoritos de la casa.
        </p>
      </div>

      <p *ngIf="cargando()" class="text-center text-on-surface-variant font-body-md">Cargando la carta…</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-md lg:gap-gutter">
        <article *ngFor="let p of platos()"
                 class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
          <div class="p-md flex flex-col flex-1">
            <div class="flex justify-between items-start mb-sm">
              <h3 class="font-headline-md text-[18px] font-bold text-on-surface">{{ p.nombre }}</h3>
              <span class="font-label-md text-label-md text-primary font-bold">S/ {{ p.precio | number: '1.0-0' }}</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant mb-md flex-1">{{ p.descripcion }}</p>
            <button class="w-full bg-surface-container text-primary font-label-md text-label-md py-sm rounded-lg
                           hover:bg-primary-container hover:text-on-primary transition-colors inline-flex items-center justify-center gap-xs font-semibold">
              <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              Agregar al Pedido
            </button>
          </div>
        </article>
      </div>
    </section>

    <footer class="bg-surface-container-highest mt-xl">
      <div class="px-margin-mobile md:px-margin-desktop py-lg max-w-[1440px] mx-auto">
        <h2 class="font-headline-md text-headline-md font-bold text-primary mb-xs">Chifa Wok</h2>
        <p class="font-body-md text-body-md text-on-surface opacity-80">© 2026 Chifa Wok · Excelencia Peruano-China · Lima</p>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  private readonly catalogo = inject(CatalogService);
  readonly platos = signal<Plato[]>([]);
  readonly cargando = signal(true);

  constructor() {
    this.catalogo.destacados().subscribe({
      next: (p) => { this.platos.set(p); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }
}

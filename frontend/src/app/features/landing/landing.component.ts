import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { Plato } from '../../core/models';
import { VoiceWidgetState } from '../voice-widget/voice-widget.state';

/** Imagenes de referencia del diseno (Google Stitch). El backend puede sobrescribirlas via plato.imagenUrl. */
const HERO_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsnUl46GtuZLwd_SP_6pZVPnukZvUKoYE6ih180sXMzjKkCQwW6nfsVQAzpubLKuvD_zyXB5Ag2uN5FdgD_RSYd654GBQiICCpjMTj4wTwLzAiSPcRw27EzWFWhF3pkXIblV7trvbE2ya143cis-bkclAtl15wgBz1m1gIKfI6ZkrMo4O2jkQapAH5PpzYT3tGcU-wfSEYivLlQd_Y7zMXdwUh4T5NTX1VVWbYDssCbSF6tOy-lTcb2Q';
const ABOUT_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCVc4XKSUWJHX1DQdr-wkGvKxCzpcEsXrHgJnIRK8x2emLCkCl7XcYvtb1IHflTz82M4I9bP8JhhYojaJmGbt5-VFJvOOycK_PqQ6LuJO3CxMOLe4BOi5V0Yx7PhJnBCRAYLNNqbKh5AJjawHOe3wGfM0Z1Sc6vaz18fhSGDyRPL9gj1degCpbGypHvjjlrE1TOretI3-gEllGEm4AOmrUbVwkopbn_CyktgDv3aTrOiDPNmpSxvFzUiQ';
const IMG_POR_CODIGO: Record<string, string> = {
  'CHF-001':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLP7gwhETnp5yMrpOKYeIvy4ScmAhJLGJ39PsQothoMI1z-4_YpCki2e106wwH8yIP8hFoT5-0F0K5myZ2YSc03fUG2OKQ3VIiPrk-uTLw5L8YmdHYmBdS2pidBh45IFh4Ove5Pt5DonlizJ5ZMIHchanHat0kwqnasGBduaf6E5dq9NNZRtjR-zeJuoovLsvYvDqkt5kA4KUsR15wB5wyLmoNwDGfvhDJdydolANZuxM6-SGRwziLHg',
  'CMB-002':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBTwVRf2SjN32f_Jt0_fmHp3NrFAUgnMZcUB9VaPaalJv3I3R36f9joJcnAkvScVZ8A5J88gPz3IjhlfKgx7UdksLMNObq9U8PU4dEme7RU9Gntj0W3iWgu74fjp7t43SBC4cEtN1zO0_0J65qAr4qqJCiwwbTpilPJyFiedohQgFJm0NyjYi5deoTUl8A-1TZHFe6mieCWjfInAOjHi_1wVvzsOQxeW7vcjK5jSh0ld6MPvT00VVCuNQ',
  'CMB-001':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCdE8ahyGGBGz4vRvLdJTlm1YKV6HOWDWouf3EmtIdU9Mtb1zbnWN8mieyd_VAikMGJeoE1y6HsXsF1tF9OnD3nGOoZqmqFPdubFQk-VnSzFru47sLU6IDUFmJ4s6Xyulr7cavSWHDsOS0kq5dbhGYLjhtydMoUSJsRGkv9of-mYX6zPbYSTfzzFup5p1AFSJyNDt8IvYsyvik-8M_ppQWIeA31GOZQifJD7HGQLwjY-hlr8eWjApR4Gg',
};

@Component({
  selector: 'cw-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- TopNavBar -->
    <nav class="bg-surface shadow-sm sticky top-0 z-40">
      <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto h-20">
        <a class="text-headline-md font-headline-md font-bold text-primary" href="#inicio">Chifa Wok</a>
        <div class="hidden md:flex items-center gap-gutter">
          <a href="#menu" class="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors">Carta</a>
          <a href="#about" class="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors">Nosotros</a>
          <a routerLink="/ingresar" class="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors">Panel</a>
        </div>
        <div class="flex items-center gap-sm">
          <button (click)="widget.abrir()" aria-label="Asistente de voz"
                  class="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span class="material-symbols-outlined">mic</span>
          </button>
          <button (click)="widget.abrir()"
                  class="bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-full hover:opacity-90 transition-opacity font-bold">
            Pide Ahora
          </button>
        </div>
      </div>
    </nav>

    <main id="inicio">
      <!-- Hero -->
      <section class="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <div class="w-full h-full bg-cover bg-center" [style.background-image]="bg(heroBg)"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent z-10"></div>
        </div>

        <div class="relative z-20 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full flex flex-col md:flex-row items-center gap-lg">
          <div class="flex-1 max-w-2xl text-left">
            <div class="inline-block bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-semibold mb-sm">
              Integracion de IA de Voz
            </div>
            <h1 class="font-display-lg text-display-lg text-on-background mb-md">Pide tu Chifa Favorito con la Voz</h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl">
              Tecnologia Voice AI para una experiencia sin esperas. El futuro de los pedidos rapidos,
              precisos y deliciosos ya esta aqui. Habla con naturalidad y empezaremos a cocinar.
            </p>
            <div class="flex flex-col sm:flex-row gap-md">
              <button (click)="widget.abrir()"
                      class="bg-tertiary-container text-on-tertiary font-label-md text-label-md px-lg py-md rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-sm group relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-[#1976D2] to-[#0D47A1] opacity-100 group-hover:opacity-90 transition-opacity"></div>
                <span class="material-symbols-outlined relative z-10">settings_voice</span>
                <span class="relative z-10 font-bold">Probar Asistente de Voz</span>
              </button>
              <a href="#menu"
                 class="bg-surface text-primary border border-primary font-label-md text-label-md px-lg py-md rounded-full hover:bg-surface-container-low transition-colors font-bold text-center">
                Ver Menu Completo
              </a>
            </div>
          </div>

          <!-- Tarjeta de conversacion (glass) -->
          <div class="hidden md:flex flex-1 justify-center relative">
            <div class="glass-effect rounded-2xl p-md shadow-xl max-w-sm w-full border border-outline-variant relative">
              <div class="flex items-center gap-sm mb-md pb-sm border-b border-surface-variant">
                <div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center pulse-animation">
                  <span class="material-symbols-outlined text-on-tertiary text-sm">mic</span>
                </div>
                <span class="font-label-md text-label-md text-on-surface">Asistente de IA</span>
              </div>
              <div class="space-y-sm">
                <div class="bg-surface-container-low p-sm rounded-lg rounded-tr-none max-w-[85%] ml-auto">
                  <p class="font-body-md text-body-md text-on-surface">"Quiero un aeropuerto familiar y dos Inka Kolas, por favor."</p>
                </div>
                <div class="bg-primary-fixed p-sm rounded-lg rounded-tl-none max-w-[85%]">
                  <p class="font-body-md text-body-md text-on-primary-fixed-variant">"Excelente! Tu Aeropuerto Familiar y 2 Inka Kolas estan en marcha. Deseas agregar wantanes fritos?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Platos Estrella -->
      <section class="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto" id="menu">
        <div class="text-center mb-xl">
          <h2 class="font-headline-lg text-headline-lg text-on-background mb-sm">Platos Estrella</h2>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Descubre nuestros platos mas queridos, preparados con la mezcla perfecta de ingredientes
            tradicionales peruanos y tecnicas culinarias chinas.
          </p>
        </div>

        <p *ngIf="cargando()" class="text-center text-on-surface-variant font-body-md">Cargando la carta...</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-md lg:gap-gutter">
          <article *ngFor="let p of platos(); let i = index"
                   class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-md transition-shadow relative flex flex-col">
            <span *ngIf="i === 1"
                  class="absolute top-sm right-sm z-10 bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-semibold">
              Popular
            </span>
            <div class="h-48 overflow-hidden">
              <div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                   [style.background-image]="bg(imagen(p))"></div>
            </div>
            <div class="p-md flex flex-col flex-1">
              <div class="flex justify-between items-start mb-sm">
                <h3 class="font-headline-md text-[18px] font-bold text-on-surface">{{ p.nombre }}</h3>
                <span class="font-label-md text-label-md text-primary font-bold">S/ {{ p.precio | number: '1.0-0' }}</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant mb-md flex-1">{{ p.descripcion }}</p>
              <button (click)="widget.abrir()"
                      class="w-full bg-surface-container text-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary-container hover:text-on-primary transition-colors flex items-center justify-center gap-xs font-semibold">
                <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Agregar al Pedido
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Nosotros -->
      <section class="bg-surface-container py-xl px-margin-mobile md:px-margin-desktop" id="about">
        <div class="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div class="space-y-md">
            <h2 class="font-headline-lg text-headline-lg text-on-background">Tradicion con Vision de Futuro</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant">
              Fundado en 2023 en el corazon de Lima, Chifa Wok nacio de la pasion por la autentica cocina
              peruano-china y el deseo de revolucionar la experiencia gastronomica. Honramos las tradiciones
              centenarias del wok hei al tiempo que adoptamos tecnologia de vanguardia.
            </p>
            <p class="font-body-lg text-body-lg text-on-surface-variant">
              Nuestra mision es servir comida espectacular sin esperas. Al integrar Voice AI en nuestro sistema
              de pedidos, tus deseos culinarios se traducen directamente a la cocina con perfecta precision.
            </p>
            <div class="flex items-center gap-sm mt-lg">
              <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-on-primary">restaurant</span>
              </div>
              <div>
                <p class="font-label-md text-label-md font-bold text-on-surface">Recetas Autenticas</p>
                <p class="font-body-md text-body-md text-on-surface-variant text-sm">Perfeccionadas en Lima</p>
              </div>
            </div>
          </div>
          <div class="relative h-[400px] rounded-2xl overflow-hidden shadow-sm">
            <div class="w-full h-full bg-cover bg-center" [style.background-image]="bg(aboutBg)"></div>
            <div class="absolute bottom-md left-md right-md glass-effect p-md rounded-xl border border-white/20">
              <div class="flex items-center gap-sm">
                <span class="material-symbols-outlined text-tertiary-container">psychology</span>
                <span class="font-label-md text-label-md text-on-surface">Cocina de Precision impulsada por IA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-surface-container-highest mt-xl">
      <div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-lg max-w-[1440px] mx-auto gap-md">
        <div>
          <h2 class="font-headline-md text-headline-md font-bold text-primary mb-xs">Chifa Wok</h2>
          <p class="font-body-md text-body-md text-on-surface opacity-80 text-sm">© 2026 Chifa Wok. Excelencia Peruano-China. Lima.</p>
        </div>
        <div class="flex flex-wrap gap-lg">
          <div class="flex flex-col gap-sm">
            <a href="#about" class="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">Nuestra Historia</a>
            <a href="#" class="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">Contactanos</a>
          </div>
          <div class="flex flex-col gap-sm">
            <a href="#" class="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">Politica de Privacidad</a>
            <a href="#" class="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">Terminos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  private readonly catalogo = inject(CatalogService);
  readonly widget = inject(VoiceWidgetState);

  readonly heroBg = HERO_BG;
  readonly aboutBg = ABOUT_BG;
  readonly platos = signal<Plato[]>([]);
  readonly cargando = signal(true);

  constructor() {
    this.catalogo.destacados().subscribe({
      next: (p) => { this.platos.set(p.slice(0, 3)); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }

  imagen(p: Plato): string {
    return p.imagenUrl || IMG_POR_CODIGO[p.codigo] || HERO_BG;
  }
  bg(url: string): string {
    return `url('${url}')`;
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { VoiceWidgetState } from '../voice-widget/voice-widget.state';

@Component({
  selector: 'cw-account-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex min-h-screen bg-surface-container-low">
      <!-- SideNavBar -->
      <nav class="hidden lg:flex flex-col h-screen p-md bg-surface border-r border-outline-variant w-64 fixed left-0 top-0 z-40">
        <div class="flex items-center gap-sm mb-lg">
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold">CW</div>
          <div>
            <h1 class="font-headline-md text-headline-md font-bold text-primary leading-none">Chifa Wok</h1>
            <p class="font-label-sm text-label-sm text-on-surface-variant">Fusion Peruano-China</p>
          </div>
        </div>

        <div class="flex-1 space-y-2">
          <a routerLink="/" class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined">home</span><span class="font-label-md text-label-md">Inicio</span>
          </a>
          <button (click)="widget.abrir()" class="w-full flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined">settings_voice</span><span class="font-label-md text-label-md">Asistente de Voz</span>
          </button>
          <a routerLink="/carta" routerLinkActive="text-primary font-bold border-r-4 border-primary bg-primary-fixed"
             class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined">restaurant_menu</span><span class="font-label-md text-label-md">Carta</span>
          </a>
          <a routerLink="/mis-pedidos" routerLinkActive="text-primary font-bold border-r-4 border-primary bg-primary-fixed"
             class="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined">receipt_long</span><span class="font-label-md text-label-md">Pedidos</span>
          </a>
        </div>

        <button (click)="widget.abrir()"
                class="mt-auto w-full py-3 bg-primary-container text-on-primary rounded-full font-label-md text-label-md hover:bg-primary transition-colors flex items-center justify-center gap-2">
          <span class="material-symbols-outlined">shopping_cart</span> Pide Ahora
        </button>
      </nav>

      <!-- Top bar movil -->
      <div class="lg:hidden fixed top-0 inset-x-0 h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile z-40">
        <span class="font-headline-md text-headline-md font-bold text-primary">Chifa Wok</span>
        <div class="flex gap-sm">
          <a routerLink="/carta" class="material-symbols-outlined text-on-surface-variant">restaurant_menu</a>
          <a routerLink="/mis-pedidos" class="material-symbols-outlined text-on-surface-variant">receipt_long</a>
        </div>
      </div>

      <main class="flex-1 lg:ml-64 p-margin-mobile md:p-gutter lg:p-margin-desktop pt-20 lg:pt-margin-desktop w-full">
        <div class="max-w-[1440px] mx-auto">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class AccountShellComponent {
  readonly widget = inject(VoiceWidgetState);
}

import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'cw-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen flex bg-surface-container-low text-on-background">
      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col w-64 bg-surface border-r border-outline-variant fixed inset-y-0 left-0 z-40">
        <div class="h-20 flex items-center gap-sm px-md border-b border-outline-variant">
          <div class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold text-[15px]">CW</div>
          <div>
            <p class="font-headline-md text-[17px] font-bold text-primary leading-none">Chifa Wok</p>
            <p class="font-label-sm text-label-sm text-on-surface-variant">Panel administrativo</p>
          </div>
        </div>

        <nav class="flex-1 p-sm space-y-xs">
          <p class="font-label-sm text-label-sm text-on-surface-variant px-sm pt-sm pb-xs uppercase tracking-wide">Gestion</p>
          <a *ngFor="let l of links" [routerLink]="l.path"
             routerLinkActive="bg-primary-fixed text-primary font-bold border-primary" #rla="routerLinkActive"
             class="flex items-center gap-sm px-sm py-sm rounded-lg border-l-4 border-transparent text-on-surface-variant hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-[22px]" [class.fill-icon]="rla.isActive">{{ l.icon }}</span>
            <span class="font-label-md text-label-md">{{ l.label }}</span>
          </a>
        </nav>

        <div class="p-sm border-t border-outline-variant">
          <div class="flex items-center gap-sm px-sm py-sm">
            <div class="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md font-bold">
              {{ inicial() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-label-md text-label-md text-on-surface truncate">{{ auth.usuario()?.nombre }}</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">{{ auth.usuario()?.rol }}</p>
            </div>
            <button (click)="salir()" aria-label="Cerrar sesion"
                    class="text-on-surface-variant hover:text-error transition-colors">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Contenido -->
      <div class="flex-1 md:ml-64 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-20 bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile md:px-gutter sticky top-0 z-30">
          <div>
            <h1 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background leading-none">{{ titulo() }}</h1>
            <p class="font-label-sm text-label-sm text-on-surface-variant mt-xs">{{ hoy }}</p>
          </div>
          <button (click)="salir()"
                  class="md:hidden flex items-center gap-xs font-label-md text-label-md text-error">
            <span class="material-symbols-outlined text-[20px]">logout</span> Salir
          </button>
        </header>

        <!-- Tabs moviles -->
        <nav class="md:hidden flex gap-xs overflow-x-auto px-margin-mobile py-sm bg-surface border-b border-outline-variant">
          <a *ngFor="let l of links" [routerLink]="l.path"
             routerLinkActive="bg-primary text-on-primary"
             class="whitespace-nowrap px-md py-xs rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant">
            {{ l.label }}
          </a>
        </nav>

        <main class="flex-1 p-margin-mobile md:p-gutter">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly links = [
    { path: 'dashboard', label: 'Dashboard', icon: 'monitoring' },
    { path: 'pedidos', label: 'Pedidos', icon: 'receipt_long' },
    { path: 'sesiones-voz', label: 'Sesiones de voz', icon: 'graphic_eq' },
  ];

  readonly hoy = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());

  private readonly url = signal(this.router.url);
  readonly titulo = computed(() => {
    const l = this.links.find((x) => this.url().includes(x.path));
    return l?.label ?? 'Administracion';
  });

  inicial(): string {
    return (this.auth.usuario()?.nombre ?? 'A').charAt(0).toUpperCase();
  }

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/ingresar']);
  }
}

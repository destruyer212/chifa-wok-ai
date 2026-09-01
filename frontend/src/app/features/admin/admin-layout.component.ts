import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'cw-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen flex bg-surface-container-low">
      <aside class="w-60 bg-surface border-r border-outline-variant flex flex-col">
        <div class="h-20 flex items-center px-md font-headline-md text-headline-md font-bold text-primary">
          Chifa Wok
        </div>
        <nav class="flex-1 px-sm space-y-xs">
          <a *ngFor="let l of links" [routerLink]="l.path" routerLinkActive="bg-primary-container text-on-primary"
             class="flex items-center gap-sm px-sm py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container">
            <span class="material-symbols-outlined">{{ l.icon }}</span>{{ l.label }}
          </a>
        </nav>
        <button (click)="salir()" class="m-sm px-sm py-sm rounded-lg font-label-md text-label-md text-error hover:bg-error-container flex items-center gap-sm">
          <span class="material-symbols-outlined">logout</span>Cerrar sesión
        </button>
      </aside>

      <main class="flex-1 p-md md:p-lg overflow-auto">
        <header class="mb-lg flex items-center justify-between">
          <h1 class="font-headline-lg text-headline-lg text-on-background">Administración</h1>
          <span class="font-label-md text-label-md text-on-surface-variant">{{ auth.usuario()?.nombre }}</span>
        </header>
        <router-outlet />
      </main>
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

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/ingresar']);
  }
}

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'ingresar',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },

  // ---- Zona del cliente (sidebar) ----
  {
    path: '',
    loadComponent: () =>
      import('./features/account/account-shell.component').then((m) => m.AccountShellComponent),
    children: [
      {
        path: 'carta',
        loadComponent: () =>
          import('./features/account/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'mis-pedidos',
        loadComponent: () =>
          import('./features/account/mis-pedidos.component').then((m) => m.MisPedidosComponent),
      },
    ],
  },

  // ---- Panel administrativo (JWT) ----
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./features/admin/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'sesiones-voz',
        loadComponent: () =>
          import('./features/admin/voice-sessions.component').then((m) => m.VoiceSessionsComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];

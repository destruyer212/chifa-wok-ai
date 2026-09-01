import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'ingresar',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
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

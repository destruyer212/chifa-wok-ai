import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'cw-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex bg-background">
      <!-- Panel de marca -->
      <aside class="hidden lg:flex flex-col justify-between w-2/5 bg-primary text-on-primary p-xl relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-on-primary/5"></div>
        <div class="absolute -left-16 bottom-10 w-64 h-64 rounded-full bg-on-primary/5"></div>

        <div class="flex items-center gap-sm relative z-10">
          <div class="w-11 h-11 rounded-full bg-on-primary text-primary flex items-center justify-center font-headline-md font-bold">CW</div>
          <div>
            <p class="font-headline-md text-headline-md font-bold leading-none">Chifa Wok</p>
            <p class="font-label-sm text-label-sm opacity-80">Peruano-Chino Moderno</p>
          </div>
        </div>

        <div class="relative z-10">
          <h1 class="font-display-lg text-display-lg mb-md">Panel de operaciones</h1>
          <p class="font-body-lg text-body-lg opacity-90 max-w-sm">
            Gestiona pedidos en vivo, revisa las sesiones del asistente de voz y sigue las ventas del dia.
          </p>
        </div>

        <p class="font-label-sm text-label-sm opacity-70 relative z-10">© 2026 Chifa Wok · Voice AI Business Assistant</p>
      </aside>

      <!-- Formulario -->
      <main class="flex-1 flex items-center justify-center p-margin-mobile">
        <div class="w-full max-w-sm">
          <a routerLink="/" class="inline-flex items-center gap-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors mb-lg">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span> Volver al inicio
          </a>

          <div class="lg:hidden flex items-center gap-sm mb-lg">
            <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold">CW</div>
            <span class="font-headline-md text-headline-md font-bold text-primary">Chifa Wok</span>
          </div>

          <h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs">Bienvenido de nuevo</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Ingresa con tu cuenta del panel administrativo.</p>

          <form [formGroup]="form" (ngSubmit)="enviar()" class="space-y-md">
            <!-- Email -->
            <label class="block">
              <span class="font-label-md text-label-md text-on-surface">Correo</span>
              <div class="mt-xs relative">
                <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                <input type="email" formControlName="email" autocomplete="username"
                       class="w-full rounded-lg border border-outline bg-surface-container-lowest pl-11 pr-sm py-sm font-body-md text-body-md
                              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                       [class.border-error]="invalido('email')" />
              </div>
              <span *ngIf="invalido('email')" class="font-label-sm text-label-sm text-error mt-xs block">Ingresa un correo valido</span>
            </label>

            <!-- Password con toggle -->
            <label class="block">
              <span class="font-label-md text-label-md text-on-surface">Contraseña</span>
              <div class="mt-xs relative">
                <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                <input [type]="verPass() ? 'text' : 'password'" formControlName="password" autocomplete="current-password"
                       class="w-full rounded-lg border border-outline bg-surface-container-lowest pl-11 pr-11 py-sm font-body-md text-body-md
                              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                       [class.border-error]="invalido('password')" />
                <button type="button" (click)="verPass.set(!verPass())"
                        [attr.aria-label]="verPass() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                        class="absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-[20px]">{{ verPass() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <span *ngIf="invalido('password')" class="font-label-sm text-label-sm text-error mt-xs block">La contraseña es obligatoria</span>
            </label>

            <div *ngIf="error()" class="flex items-center gap-xs bg-error-container text-on-error-container rounded-lg px-sm py-xs">
              <span class="material-symbols-outlined text-[18px]">error</span>
              <span class="font-label-sm text-label-sm">{{ error() }}</span>
            </div>

            <button type="submit" [disabled]="cargando()"
                    class="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg font-bold
                           hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-xs">
              <span *ngIf="cargando()" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              {{ cargando() ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>

          <div class="mt-lg rounded-lg border border-outline-variant bg-surface-container-low p-sm">
            <p class="font-label-sm text-label-sm text-on-surface-variant">
              <span class="font-bold text-on-surface">Demo:</span> admin&#64;chifawok.pe · admin123
            </p>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal('');
  readonly verPass = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['admin@chifawok.pe', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required]],
  });

  invalido(campo: 'email' | 'password'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.dirty || c.touched);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => {
        this.error.set('Correo o contraseña incorrectos');
        this.cargando.set(false);
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'cw-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface-container-low px-margin-mobile">
      <div class="w-full max-w-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-lg">
        <h1 class="font-headline-md text-headline-md font-bold text-primary mb-xs">Chifa Wok</h1>
        <p class="font-body-md text-body-md text-on-surface-variant mb-lg">Panel administrativo</p>

        <form [formGroup]="form" (ngSubmit)="enviar()" class="space-y-md">
          <label class="block">
            <span class="font-label-md text-label-md text-on-surface">Correo</span>
            <input type="email" formControlName="email" autocomplete="username"
                   class="mt-xs w-full rounded-lg border border-outline px-sm py-sm font-body-md text-body-md" />
          </label>
          <label class="block">
            <span class="font-label-md text-label-md text-on-surface">Contraseña</span>
            <input type="password" formControlName="password" autocomplete="current-password"
                   class="mt-xs w-full rounded-lg border border-outline px-sm py-sm font-body-md text-body-md" />
          </label>

          <p *ngIf="error()" class="font-label-sm text-label-sm text-error">{{ error() }}</p>

          <button type="submit" [disabled]="form.invalid || cargando()"
                  class="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg font-bold disabled:opacity-50">
            {{ cargando() ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>

        <p class="mt-md font-label-sm text-label-sm text-on-surface-variant">
          Demo: admin&#64;chifawok.pe / admin123
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['admin@chifawok.pe', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required]],
  });

  enviar(): void {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => {
        this.error.set('Credenciales incorrectas');
        this.cargando.set(false);
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface SesionVoz {
  id: number;
  transcripcionUsuario: string;
  respuestaAsistente: string;
  intencion: string;
  exito: boolean;
  latenciaMs: number;
  modeloLlm: string;
  creadoEn: string;
}

@Component({
  selector: 'cw-voice-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="font-body-md text-body-md text-on-surface-variant mb-md">
      {{ sesiones().length }} sesiones registradas · lo que dijo el cliente y como respondio el asistente.
    </p>

    <div class="space-y-sm">
      <article *ngFor="let s of sesiones()"
               class="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <div class="flex items-center gap-sm mb-sm flex-wrap">
          <span class="font-label-sm text-label-sm px-sm py-xs rounded-full"
                [class]="s.exito ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">
            {{ s.intencion || 'SIN INTENCION' }}
          </span>
          <span class="font-label-sm text-label-sm text-on-surface-variant">{{ s.creadoEn | date: 'dd MMM, HH:mm' }}</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
            <span class="material-symbols-outlined text-[16px]">bolt</span>{{ s.latenciaMs }} ms
          </span>
          <span class="font-label-sm text-label-sm text-on-surface-variant ml-auto">{{ s.modeloLlm }}</span>
        </div>
        <div class="grid md:grid-cols-2 gap-sm">
          <div class="bg-surface-container-high rounded-lg p-sm">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-xs">Cliente</p>
            <p class="font-body-md text-body-md text-on-surface">{{ s.transcripcionUsuario || '—' }}</p>
          </div>
          <div class="bg-tertiary-fixed rounded-lg p-sm">
            <p class="font-label-sm text-label-sm text-on-tertiary-fixed-variant mb-xs">Asistente Wok</p>
            <p class="font-body-md text-body-md text-on-tertiary-fixed-variant">{{ s.respuestaAsistente || '—' }}</p>
          </div>
        </div>
      </article>
    </div>

    <p *ngIf="!sesiones().length" class="font-body-md text-body-md text-on-surface-variant mt-lg text-center">
      Aun no hay sesiones de voz. Prueba el asistente desde la web del cliente.
    </p>
  `,
})
export class VoiceSessionsComponent {
  private readonly http = inject(HttpClient);
  readonly sesiones = signal<SesionVoz[]>([]);

  constructor() {
    this.http
      .get<{ content: SesionVoz[] }>(`${environment.apiBaseUrl}/voz/sesiones?size=50`)
      .subscribe({ next: (r) => this.sesiones.set(r.content ?? []) });
  }
}

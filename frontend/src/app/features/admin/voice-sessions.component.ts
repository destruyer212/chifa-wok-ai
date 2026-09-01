import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface SesionVoz {
  id: number; transcripcionUsuario: string; respuestaAsistente: string;
  intencion: string; exito: boolean; latenciaMs: number; modeloLlm: string; creadoEn: string;
}

@Component({
  selector: 'cw-voice-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
      <table class="w-full font-body-md text-body-md">
        <thead class="bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
          <tr>
            <th class="text-left px-md py-sm">Cliente dijo</th>
            <th class="text-left px-md py-sm">Asistente respondió</th>
            <th class="px-md py-sm">Intención</th>
            <th class="px-md py-sm">Latencia</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of sesiones()" class="border-t border-outline-variant align-top">
            <td class="px-md py-sm text-on-surface max-w-xs">{{ s.transcripcionUsuario }}</td>
            <td class="px-md py-sm text-on-surface-variant max-w-xs">{{ s.respuestaAsistente }}</td>
            <td class="px-md py-sm text-center">
              <span class="font-label-sm text-label-sm px-sm py-xs rounded-full"
                    [class]="s.exito ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'">
                {{ s.intencion || '—' }}
              </span>
            </td>
            <td class="px-md py-sm text-center text-on-surface-variant">{{ s.latenciaMs }} ms</td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="!sesiones().length" class="p-md font-body-md text-on-surface-variant">Aún no hay sesiones de voz.</p>
    </div>
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

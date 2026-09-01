import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechService } from './speech.service';
import { VoiceApiService } from '../../core/voice-api.service';
import { ItemSugerido } from '../../core/models';

interface Mensaje { rol: 'usuario' | 'asistente'; texto: string; }

@Component({
  selector: 'cw-voice-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Boton flotante -->
    <button
      *ngIf="!abierto()"
      (click)="abrir()"
      class="fixed bottom-lg right-lg w-16 h-16 bg-tertiary-container rounded-full shadow-lg
             flex items-center justify-center hover:scale-105 transition-transform z-50 pulse-animation group"
      aria-label="Abrir asistente de voz">
      <span class="material-symbols-outlined text-on-tertiary text-[28px]">mic</span>
    </button>

    <!-- Panel -->
    <div *ngIf="abierto()"
         class="fixed bottom-lg right-lg z-50 w-[92vw] max-w-sm glass-effect rounded-2xl
                shadow-xl border border-outline-variant flex flex-col overflow-hidden">
      <header class="flex items-center justify-between px-md py-sm bg-primary text-on-primary">
        <div class="flex items-center gap-sm">
          <span class="material-symbols-outlined">support_agent</span>
          <span class="font-label-md text-label-md">Asistente Chifa Wok</span>
        </div>
        <button (click)="cerrar()" aria-label="Cerrar">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <div class="flex-1 max-h-80 overflow-y-auto p-md space-y-sm bg-surface">
        <p *ngIf="!mensajes().length" class="font-body-md text-body-md text-on-surface-variant text-center">
          Presiona el microfono y dime tu pedido. Ej: "Quiero un aeropuerto familiar y dos Inka Kola".
        </p>
        <div *ngFor="let m of mensajes()"
             class="p-sm rounded-lg max-w-[85%] font-body-md text-body-md"
             [class]="m.rol === 'usuario'
               ? 'bg-surface-container-low text-on-surface ml-auto rounded-tr-none'
               : 'bg-primary-fixed text-on-primary-fixed-variant rounded-tl-none'">
          {{ m.texto }}
        </div>

        <ul *ngIf="items().length" class="mt-sm border-t border-outline-variant pt-sm space-y-xs">
          <li *ngFor="let it of items()" class="flex justify-between font-label-sm text-label-sm text-on-surface">
            <span>{{ it.cantidad }}× {{ it.nombre }}</span>
            <span>S/ {{ it.subtotal | number: '1.2-2' }}</span>
          </li>
          <li class="flex justify-between font-label-md text-label-md text-primary pt-xs border-t border-outline-variant">
            <span>Total</span><span>S/ {{ total() | number: '1.2-2' }}</span>
          </li>
        </ul>
      </div>

      <footer class="p-md bg-surface-container flex items-center gap-sm">
        <button
          (click)="toggleMic()"
          [disabled]="procesando() || !speech.soportado()"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
          [class]="speech.escuchando() ? 'bg-error text-on-error pulse-animation' : 'bg-tertiary-container text-on-tertiary'">
          <span class="material-symbols-outlined">{{ speech.escuchando() ? 'stop' : 'mic' }}</span>
        </button>
        <span class="flex-1 font-body-md text-body-md text-on-surface-variant">
          {{ estado() }}
        </span>
        <span *ngIf="speech.hablando()" class="material-symbols-outlined text-primary">volume_up</span>
      </footer>

      <p *ngIf="!speech.soportado()" class="px-md pb-sm font-label-sm text-label-sm text-error">
        Tu navegador no soporta la Web Speech API. Usa Chrome o Edge.
      </p>
    </div>
  `,
})
export class VoiceWidgetComponent {
  readonly speech = inject(SpeechService);
  private readonly api = inject(VoiceApiService);

  readonly abierto = signal(false);
  readonly procesando = signal(false);
  readonly mensajes = signal<Mensaje[]>([]);
  readonly items = signal<ItemSugerido[]>([]);
  readonly total = signal(0);
  private sesionUuid?: string;

  estado(): string {
    if (this.speech.escuchando()) return 'Escuchando…';
    if (this.procesando()) return 'Procesando tu pedido…';
    if (this.speech.hablando()) return 'Respondiendo…';
    return 'Toca el microfono para hablar';
  }

  abrir(): void { this.abierto.set(true); }
  cerrar(): void { this.speech.detener(); this.abierto.set(false); }

  toggleMic(): void {
    if (this.speech.escuchando()) {
      this.speech.detener();
      return;
    }
    this.speech.escuchar().subscribe({
      next: (texto) => this.enviar(texto),
      error: (e) => this.push('asistente', e.message),
    });
  }

  private enviar(transcripcion: string): void {
    this.push('usuario', transcripcion);
    this.procesando.set(true);
    this.api.interpretar(transcripcion, this.sesionUuid).subscribe({
      next: (r) => {
        this.sesionUuid = r.sesionUuid;
        this.items.set(r.items);
        this.total.set(r.total);
        this.push('asistente', r.respuestaAsistente);
        this.speech.hablar(r.respuestaAsistente);
        this.procesando.set(false);
      },
      error: () => {
        this.push('asistente', 'Disculpa, tuve un problema. Intenta de nuevo.');
        this.procesando.set(false);
      },
    });
  }

  private push(rol: Mensaje['rol'], texto: string): void {
    this.mensajes.update((m) => [...m, { rol, texto }]);
  }
}
